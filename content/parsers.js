/**
 * Created by M on 7/31/15.
 */


var currParsingId;

var parser = function() {
    var type = window[this.type];
    currParsingId = this.id;
    var targetParser = window[lowerFirstLetter(this.type) + 'Parser'];
    return targetParser(this.target, this.targetClass).then(function(arr){
        if(arr) {
            var options = getOptions(arr);
            currParsingId = null;
            return new type(options);
        }
    });
};

// ******************************** //
// ***********  Helpers *********** //
// ******************************** //

var rejector = function(reject) {
    errorHandler(reject, errors.APPENDTRY);
    elementSaveFailed(currParsingId);
}

var get = function(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var client = new XMLHttpRequest();
        client.open('GET', url);
        client.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (client.status == 200) resolve(client.response);
            else reject(errors.parseStatusError(client.status));
        };

        // Handle network errors
        client.onerror = function() {
            reject(errors.NETWORKPARSEERR);
        };

        // Make the request
        client.send();
    });
};

var getOptions = function(arr) {
    var options = {};
    for(var i = 0; i < arr.length; i++) {
        if(arr[i]) options[arr[i][0]] = arr[i][1];
    }
    return options;
};

var getImagePromise = function(target) {
    var targetExists =  target.length;
    if (targetExists) {
        return new Promise(function(resolve) {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = target.prop('src');
            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            }
        });
    }
};

var getId = function(target,type) {
    var targetExists =  target.length;
    if (targetExists) return ['id', getElementId(target,type)];
};

var getUrl = function(target) {
    var targetExists =  target.length;
    if (targetExists) return ['url', target.prop('href')];
};


var getTitle = function(target) {
    var targetExists =  target.length;
    if (targetExists) return ['title', target.text()];
};

var makeStandardDate = function(date) {
    var currDate = new Date();
    var month = currDate.getMonth() + 1;
    var day = currDate.getDate();
    var year = currDate.getFullYear();

    var firstEl = date.split(' ')[0];
    if (monthNamesShort.indexOf(firstEl) <= -1 && monthNames.indexOf(firstEl) <= -1) {
        if (firstEl == "Yesterday") date = date.replace("Yesterday", month + " " + (day - 1) + ",");
        else if (firstEl == "Yesterday," || firstEl == "Today," || firstEl == "Tomorrow," || dayShort.indexOf(firstEl.replace(',', '')) > -1)
            date = date.replace(firstEl + " ", '');
        else date = month + " " + day + ", " + date;
    }

    date = date.split(',');
    if (date[1].replace(" ", "").length != 4) date.splice(1, 0, year);
    date = date.join(', ');

    //TODO: add in timezone check
    //date = date.split(' ');

    return date;
};

var getDate = function(target) {
    var targetExists =  target.length;
    if (targetExists) {
        var postDate = target.text();
        if ( postDate.indexOf('-') <= -1 ){
            postDate = makeStandardDate(postDate);
        }
        var date = new Date(postDate);
        return ['date', date.toISOString()];
    }
};

var getDescription = function(target) {
    var targetExists =  target.length;
    if (targetExists) return ['description', descParser($(target[0]))];
};

var getEmbedPromise = function(target) {
    var targetExists =  target.length;
    if (targetExists) return embededElementParser(target).then(function(arr){
        var options = getOptions(arr);
        return ['embededEl', new EmbededElement(options)];
    });
};

var getRepostPromise = function(target) {
    var targetExists =  target.length;
    if (targetExists) return postParser(target, REPOST).then(function(arr){
        var options = getOptions(arr);
        return ['repostedPost', new Post(options)];
    });
};

var getPostAct = function(target,inEvent) {
    var targetExists =  target.length;
    if (targetExists) return ['postActivity', postActivityParser(target,inEvent)];
};

var getUserPromise = function(target,targetClass) {
    var targetExists =  target.length;
    if (targetExists) return userParser(target.find(convertClassFormat(targetClass)), targetClass).then(function(arr){
        var options = getOptions(arr);
        return ['user', new User(options)];
    });
};

var getStory = function(target) {
    target = target.find(USERSTORYWRAPPER);
    var targetExists =  target.length;
    if (targetExists) return ['story', storyParser(target)];
};

var getEducation = function(target) {
    target = target.find(USEREDUCTIONWRAPPER);
    var targetExists =  target.length;
    if (targetExists) return ['education', educationParser(target)];
};

var getBasic = function(target) {
    target = target.find(USERBASICWRAPPER);
    var targetExists =  target.length;
    if (targetExists) return ['basic', basicParser(target)];
};

var getContact = function(target) {
    target = target.find(USERCONTACTWRAPPER);
    var targetExists =  target.length;
    if (targetExists) return ['contact', contactParser(target)];
};

var getWork = function(target) {
    target = target.find(USERWORKWRAPPER);
    var targetExists =  target.length;
    if (targetExists) return ['work', workParser(target)];
};

var getCommunityPromise = function(target, targetClass) {
    var targetExists =  target.length;
    if (targetExists) return communityParser(target, targetClass).then(function(arr){
        var options = getOptions(arr);
        return ['community', new Community(options)];
    });
};

var getCommentsPromise = function(target,inEvent) {
    var commentsAr = [];
    var comments;
    if (inEvent) comments = target.find(POSTDOT);
    else comments = target.find(COMMENTDOT);
    var targetExists = comments.length;
    if (targetExists) {
        comments.each(function () {
            commentsAr.push(commentParser($(this),inEvent).then(function(arr){
                var options = getOptions(arr);
                return new Comment(options);
            }));
        });
        return Promise.all(commentsAr).then(function(arr){
            return ['comments', arr];
        });
    }
};

var convertMemberToInt = function(str) {
    str = str.split(' ')[0];
    str = str.split(',');
    str = str.join('');
    return Number(str);
};

var getMembers = function(target) {
    var targetExists =  target.length;
    if (targetExists) return ['members', convertMemberToInt(target.text())];
};

// ******************************** //
// ****  User Parser & Helpers **** //
// ******************************** //

var getUserTarget = function(target, targetClass, parentName) {
    if (parentName) target = target.parents(parentName);
    target = target.find(getUserLink[targetClass]);
    return target;
};

var userParser = function(target, targetClass) {
    if ( findLinkOfUser.indexOf(targetClass) > -1 ) {
        target = getUserTarget(target, targetClass, userParent[targetClass]);
    }
    var url;
    if ( targetClass == USERIMAGEPAGE ) {
        url = window.location.href;
        if ( window.location.href.indexOf('/about') > -1 )
            return Promise.all(getUserPromises(target.parents(USERABOUTPAGEWRAPPER))).then(function(response){
                response.push(['url', url]);
                return response;
            });
        else url = url.substring(0,url.lastIndexOf('/')) + '/about';
    }
    else url = target.prop('href') + '/about';
    return get(url).then($.parseHTML).then(
        function(response){
            return Promise.all( getUserPromises($(response).find(USERABOUTPAGEWRAPPER))).then(function(response){
                response.push(['url', url]);
                return response;
            });
        },
        function(reject) {rejector(reject)}
    );
};

var getUserPromises = function(target) {
    var image = getImagePromise(target.find(USERIMAGEPAGEDOT));
    if (image) image = image.then(function(base64){ return ['image', base64] });
    var title = getTitle(target.find(USERPAGENAMEDOT));
    var story = getStory(target);
    var education = getEducation(target);
    var basic = getBasic(target);
    var contact = getContact(target);
    var work = getWork(target);
    return [image, title, story, education, basic, contact, work];
};

var setAboutOptions = function(options, target, keyClass) {
    var key = target.find(keyClass).text().toLowerCase().split(' ')[0];
    if (target.length) options[key] = target.find(USERABOUTTEXT).text(); //descParser(target.find(USERABOUTTEXT));
};

var setAboutContactOptions = function(options, target, keyClass) {
    var key = target.find(keyClass).text().toLowerCase().split(' ')[0];
    if (target.length) options[key] = getAllContactInfo(target.find(USERABOUTTEXT)); //descParser(target.find(USERABOUTTEXT));
};

// TODO: get links, html, etc?
var storyParser = function(target) {
    var options = {};
    target.find(USERABOUTCAT).each(function(){
        setAboutOptions(options,$(this), USERABOUTCOMMONTITLE);
    });
    return new Story(options);
};

var educationParser = function(target) {
    var options = {};
    var degrees = [];
    target.find(USEREDUCATIONDEGREE).each(function(){
        degrees.push(degreeParser($(this)));
    });
    options['degrees'] = degrees;
    return new Education(options);
};

var degreeParser = function(target) {
    var options = {};
    var school = target.find(DEGREESCHOOL);
    if(school.length) options['school'] = school.text();
    var info = target.find(DEGREEINFO);
    if(info.length) options['info'] = info.text();
    return new Degree(options);
};

var basicParser = function(target) {
    var options = {};
    target.find(USERABOUTCAT).each(function(){
        setAboutOptions(options,$(this), BASICTITLES);
    });
    return new Basic(options);
};

var contactParser = function(target) {
    var options = {};
    target.find(USERABOUTCAT).each(function(){
        setAboutContactOptions(options,$(this), USERABOUTCOMMONTITLE);
    });
    return new Contact(options);
};

var getAllContactInfo = function(target) {
    var contactInfos = [];
    var contactInfo;
    target.find(CONTACTINFOCONTAINER).each(function(){
        contactInfo = contactInfoParser($(this));
        if (contactInfo) contactInfos.push(contactInfo);
    });
    if(contactInfos.length) return contactInfos;
};

var contactInfoParser = function(target) {
    var options = {};
    var type = target.find(CONTACTTYPE);
    if(type.length) options['type'] = type.text();
    else return false;
    var value = target.find(CONTACTVALUE);
    var email = target.find(CONTACTEMAIL);
    if(value.length) options['value'] = value.text();
    else if(email.length) options['value'] = email.text();
    else return false;
    return new ContactInfo(options);
};

var workParser = function(target) {
    var options = {};
    target.find(USERABOUTCAT).each(function(){
        setAboutOptions(options,$(this), USERABOUTCOMMONTITLE);
    });
    return new Work(options);
};

// *********************************** //
// ****** Post Parser & Helpers ****** //
// *********************************** //

var checkRepost = function(target) {
    return target.parents(REPOSTDOT).length;
};

var checkEmbed = function(target) {
    return target.parents(EMBEDDOT).length;
};

var replaceDate = function(arr, date) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] && arr[i][0] == 'date') arr[i] = date;
    }
};

var postParser = function(target, targetClass) {
    var url;
    var urlDate = target.find(POSTURLDOT);
    var reposted = ( targetClass == REPOST );
    if (!reposted) url = urlDate.prop('href');
    else url = target.find(REPOSTURLDOT).prop('href');

    if( window.location == url ) return Promise.all(getPostPromises(target));
    else return get(url).then($.parseHTML).then(
        function(response){
            return Promise.all( getPostPromises($(response).find(POSTDOT))).then(function(response){
                if(!reposted) {
                    replaceDate(response,getDate(urlDate));
                }
                return response;
            });
        },
        function(reject) {rejector(reject)}
    );
};

var getPostPromises = function(target) {
    var dateLink = target.find(POSTURLDOT);
    var commPost = target.find(COMMUNITYLINKPOSTDOT);
    var rePost = target.find(REPOSTDOT);
    var description = $(target.find(DESCRIPTIONDOT).get(0));
    var embeded = target.find(EMBEDDOT);
    var desc, embedPromise;

    var id = getId(target,POSTTYPE);
    var userPromise = getUserPromise(target, USERLINKPOST);
    var communityPromise = getCommunityPromise(commPost, COMMUNITYLINKPOST);
    var date = getDate(dateLink);
    var url = getUrl(dateLink);
    var postAct = getPostAct(target);
    var commentsPromise = getCommentsPromise(target);
    var repostPromise = getRepostPromise(rePost);
    if ( !checkRepost(description) && !checkEmbed(description) ) desc = getDescription(description);
    if ( !checkRepost(embeded) ) embedPromise = getEmbedPromise(embeded);

    return [id, userPromise, communityPromise, date, url, postAct, commentsPromise, repostPromise, desc, embedPromise];
};

// ************************************ //
// * Hangout & Event Parser & Helpers * //
// ************************************ //

var eventParser = function(target, targetClass) {
    var inEvent = ( targetClass == EVENT );
    if (!inEvent) return Promise.all(getEventPromises(target, inEvent));
    else return Promise.all(getEventPromises(target.parents(INEVENTWRAPPER), inEvent));
};

var hangoutParser = function(target, targetClass) {
    return eventParser(target, targetClass);
};

var getEventPromises = function(target, inEvent) {
    var url, title, date, description, userPromise, postAct, commentsPromise;
    if ( inEvent ) {
        url = getUrl($(window.location));
        title = getTitle(target.find(EVENTDOT));
        date = getDate(target.find(EVENTDATEDOT));
        description = getDescription(target.find(DESCRIPTIONDOT));
        userPromise = getUserPromise(target, USERLINKEVENT);
        postAct = getPostAct(target, true);
        commentsPromise = getCommentsPromise(target, true);
    } else {
        var eventLink = target.find(EVENTLINKDOT);
        if (!eventLink.length) eventLink = target.find(POSTEVENTLINKDOT);
        url = getUrl(eventLink);
        title = getTitle(eventLink);
        date = target.find(EVENTDATEDOT);
        if (!date.length) {
            date = target.find(POSTURLDOT);
            url = getUrl(target.find(POSTURLDOT));
        }
        description = getDescription(target.find(DESCRIPTIONDOT));
        userPromise = getUserPromise(target,USERLINKPOST);
        date = getDate(date);
        postAct = getPostAct(target);
        commentsPromise = getCommentsPromise(target);
    }
    return [url, title, date, description, userPromise, postAct, commentsPromise];
};

// *********************************** //
// * EmbededElement Parser & Helpers * //
// *********************************** //

var getEmbedUrlTitle = function(target) {
    var url, title;

    var articleUrlTitle = target.find(EMBEDURLTITLEPARENTDOT).find(EMBEDURLTITLEDOT);
    if (!articleUrlTitle.length) articleUrlTitle = target.find(EMBEDURLTITLEPARENTDRIVEDOT).find(EMBEDURLTITLEDOT);
    var videoUrlTitle = target.find(EMBEDVIDEOURLTITLEDOT);
    var urlPhoto = target.find(EMBEDALLPHOTOSDOT);
    var urlTitle = target.find(EMBEDLINKDOT);

    if ( url = getUrl(urlPhoto) ) title = getTitle(urlPhoto);
    else if ( url = getUrl(articleUrlTitle) ) title = getTitle(articleUrlTitle);
    else if ( url = getUrl(videoUrlTitle) ) title = getTitle(videoUrlTitle);
    else if ( url = getUrl(urlTitle) ) title = getTitle(urlTitle);

    if(url) return [url, title];
};

var embededElementParser = function(target, targetClass) {
    var images = [];
    var imagesPromise;
    var embedImgs = target.find(EMBEDPHOTODOT);
    if ( embedImgs.length ) {
        embedImgs.each(function(){
            images.push(getImagePromise($(this)));
        });
        imagesPromise = Promise.all(images).then(function(arr){
            return ['images', arr];
        });
    }
    var desc = getDescription(target.find(EMBEDDESCDOT));
    var promiseArray = [imagesPromise, desc];
    var urlTitle = getEmbedUrlTitle(target);
    if (urlTitle) promiseArray = promiseArray.concat(urlTitle);
    return Promise.all(promiseArray);
};

// ******************************** //
// ** Community Parser & Helpers ** //
// ******************************** //

var communityParser = function(target, targetClass) {
    if ( targetClass == COMMUNITYPOST || targetClass == COMMUNITYLINKPOST ) {
        if (targetClass == COMMUNITYPOST)
            target = currDragged.target.find(COMMUNITYLINKPOSTDOT);
        var url = target.prop('href');
        return get(url).then($.parseHTML).then(
            function (response) {
                return Promise.all(getcommunityPromises($(response).find(COMMUNITYPAGEDOT), COMMUNITYPAGE));
            },
            function(reject) {rejector(reject)}
        );
    } else return Promise.all(getcommunityPromises(target, targetClass));
};

var getcommunityPromises = function(target, targetClass) {
    var url, title, image, members;

    if ( communityImages.indexOf(targetClass) > -1 ) {
        image = getImagePromise(target);
    } else if ( communityLinks.indexOf(targetClass) > -1 ) {
        url = getUrl(target);
        title = getTitle(target);
    }

    var parentName = communityParentNames[targetClass];
    if (parentName) {
        target = target.parents(parentName);
    }

    var communityOptionsClass = communityFieldToClass[targetClass];
    if (communityOptionsClass) {
        if (!url) {
            if ( target.attr('class') == COMMUNITY ) url = getUrl(target.parent());
            else url = getUrl(target.find(communityOptionsClass.url));
        }
        if (!title) title = getTitle(target.find(communityOptionsClass.title));
        if (!image) image = getImagePromise(target.find(communityOptionsClass.image));
        if (!members) members = getMembers(target.find(communityOptionsClass.members));
    }

    return [url, title, image.then(function(base64){ return ['image', base64] }), members];
};


// ******************************** //
// * Description Parser & Helpers * //
// ******************************** //

var getLinkOptions = function(target) {
    var options = [];
    options.push(getUrl(target));
    options.push(getTitle(target));
    return getOptions(options);
};

var descParser = function(target) {
    var options = {};
    var links = [], profLinks = [], hashTags = [];
    var allLinks = target.find(LINKCLASSDOT);
    var linkClassSpace = LINKCLASSDOT.replace('.', ' ');
    var linkType;
    options['html'] = target.html();
    options['text'] = target.text();
    allLinks.each(function(){
        var link = $(this);
        linkType = link.attr('class').replace(linkClassSpace, '');
        switch(linkType) {
            case NORMLINK:
                links.push(new Link(getLinkOptions(link)));
                break;
            case PROFLINK:
                profLinks.push(new ProfLink(getLinkOptions(link)));
                break;
            case HASHTAG:
                hashTags.push(new HashTag(getLinkOptions(link)));
                break;
        }
    });
    options['links'] = links;
    options['profLinks'] = profLinks;
    options['hashTags'] = hashTags;
    return new Description(options);
};

// *********************************** //
// ** PostActivity Parser & Helpers ** //
// *********************************** //

var getCommentCount = function(target, inEvent) {
    var count = 0;
    if (inEvent) count = target.find(POSTDOT).length;
    else {
        var tmpCount = target.find(COMMENTCOUNTDOT).text();
        if ( tmpCount ) count = Number(tmpCount);
    }
    return count;
};

// TODO: plus count is minimum 1, even if there aren't pluses
var postActivityParser = function(target, inEvent) {
    var options = {};
    options['plusCount'] = Number(target.find(PLUSCOUNTDOT).text());
    options['commentCount'] = getCommentCount(target, inEvent);
    // TODO: find way to get share count within event
    if (!inEvent) options['shareCount'] = Number(target.find(SHARECOUNTDOT).text());
    return new PostActivity(options);
};

// ******************************** //
// *** Comment Parser & Helpers *** //
// ******************************** //

var commentParser = function(target,inEvent) {
    var desc = getDescription(target.find(DESCRIPTIONDOT));
    var userPromise;
    if (inEvent) userPromise = getUserPromise(target,USERLINKPOST);
    else userPromise = getUserPromise(target,USERLINKCOMMENT);
    return Promise.all([desc, userPromise]);
};

