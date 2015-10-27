/**
 * Created by M on 7/31/15.
 */

// ******************************** //
// **** GOOGLE CLASS CONSTANTS **** //
// ******************************** //

// ---------- Draggables ---------- //

// Users
var USERIMAGEPOST = "Uk wi hE"; // User on a post
var USERIMAGEPOSTDOT = convertClassFormat(USERIMAGEPOST);
var USERCARD = "o-ms-fk"; // User on the hover card TODO: take the whole card instead
var USERCARDDOT = convertClassFormat(USERCARD);
var USERIMAGECOMMENT = "go wi Wh"; // User associated to comment
var USERIMAGECOMMENTDOT = convertClassFormat(USERIMAGECOMMENT);
var USERIMAGEPAGE = "fa-kz Zxa"; // User on own page
var USERIMAGEPAGEDOT = convertClassFormat(USERIMAGEPAGE);
var USERIMAGESINGLEPOST = "we D0b"; // User on single post
var USERIMAGESINGLEPOSTDOT = convertClassFormat(USERIMAGESINGLEPOST);
var USERIMAGEHOME = "ho ica"; // User on home recs
var USERIMAGEHOMEDOT = convertClassFormat(USERIMAGEHOME);

// Posts
var POST = "Ee BK ge";
var POSTDOT = convertClassFormat(POST);
var REPOST = "ZG Sk";
var REPOSTDOT = convertClassFormat(REPOST);

// Event
var EVENT = "Ee Fgb";
var EVENTDOT = convertClassFormat(EVENT);

// Embed
var EMBED = "q9 yg";
var EMBEDDOT = convertClassFormat(EMBED);
var EMBEDMULTI = "q9 yg Qaa Paa";
var EMBEDMULTIDOT = convertClassFormat(EMBEDMULTI);
var EMBEDDRIVE = "q9 yg vI SS";
var EMBEDDRIVEDOT = convertClassFormat(EMBEDDRIVE);

// Community
var COMMUNITY = "Ee";
var COMMUNITYDOT = convertClassFormat(COMMUNITY);
var COMMUNITYJOINED = 'k9c mke Pic I8c JUKJAb';
var COMMUNITYJOINEDDOT = convertClassFormat(COMMUNITYJOINED);
var COMMUNITYPAGE = 'OEd';
var COMMUNITYPAGEDOT = convertClassFormat(COMMUNITYPAGE);
var COMMUNITYIMAGEHOME = 'lB ica';
var COMMUNITYIMAGEHOMEDOT = convertClassFormat(COMMUNITYIMAGEHOME);
var COMMUNITYPOST = 'GM hf Mj';
var COMMUNITYPOSTDOT = convertClassFormat(COMMUNITYPOST);

// ---------- Non- Draggables ---------- //

// Users
var USERLINKPOST ="ob tv Ub Hf";
var USERLINKPOSTDOT = convertClassFormat(USERLINKPOST);
var USERLINKCOMMENT = "ob tv Ub TD";
var USERLINKCOMMENTDOT = convertClassFormat(USERLINKCOMMENT);
var USERLINKEVENT = "ob tv Ub ita";
//var USERLINKEVENTDOT = convertClassFormat(USERLINKEVENT);
var USERLINKSINGLEPOSTDOT = ".ob.tv.Ub";
var USERLINKCARDDOT = ".Ug";
var LINKHOMEDOT = ".d-s.ob.Xi.d-k-l"; // Used for user & community
var HOMERECPARENTDOT = '.Oh'; // Used for user & community
var USERPAGENAMEDOT = ".rna.KXa.Xia.fn";
var USERCOMMENTPARENTDOT = '.Wi.lg';
var USERPOSTPARENTDOT = '.ys';
var USERIMAGECARDDOT = '.we.aYpOjc';
var USERIMAGELINK = 'ob Jk';
var USERIMAGELINKCARDDOT = '.Jk';
var USERSINGLEPOSTPARENTDOT = '.z0b';
var USERPAGEPARENTDOT = '.xna.Uza';

var USERABOUTPAGEWRAPPER = '.fa-Neb.drc.gXa';
var USERABOUTTEXT = '.y4';
var USERABOUTCAT = '.wna';
var USERABOUTCOMMONTITLE = '.Cr';

var USEREDUCTIONWRAPPER = '.Ee.vna.Jqc';
var USEREDUCATIONDEGREE = '.UZa';
var DEGREESCHOOL = '.PLa';
var DEGREEINFO = '.ija';

var USERBASICWRAPPER = '.Ee.vna.Hqc';
var BASICTITLES = '.E9a.G9a.Rqc';

var USERCONTACTWRAPPER = '.Ee.vna.VRa';
var CONTACTINFOCONTAINER = 'tr';
var CONTACTTYPE = '.MAa';
var CONTACTVALUE = '.PHb';
var CONTACTEMAIL = '.email';

var USERSTORYWRAPPER = '.Ee.vna.WRa';

var USERWORKWRAPPER = '.Ee.vna.Tqc';

// Posts
var POSTURLDOT = '.o-U-s.FI.Rg'; // Used for date too
var REPOSTURLDOT = '.xAhNqd.qg';
var REPOSTVIEWORIGDOT = '.d-s.u9W0n.ZtGLwd';
var POSTPARENT = 'Yp yt Xa';

// Events
var EVENTBANNERIMG = '.Ym';
var EVENTLINKDOT = '.d-s.ob.pw';
var HANGOUTCHECKDOT = '.P6';
var INEVENTHANGOUTCHECKDOT = '.agb';
var INEVENTWRAPPER = '.CF.he';
var POSTHANGOUTCHECKDOT = '.bU.dU';
var EVENTPARENT = 'Yp yt Xa N8b';
var EVENTPARENTDOT = convertClassFormat(EVENTPARENT);
var EVENTDATEDOT = '.d-s.Fy.Ij';
var HANGOUTIMAGEDOT = '.ar.Mc.pLOfrf.kf.zB.pG';
var EVENTIMAGEDOT = '.Xq';
var POSTHANGIMAGEDOT = '.xE.bc';
var POSTEVENTLINKDOT = '.Bba.jU.lU';

// Embed
var EMBEDPHOTODOT = ".ar.Mc";
var EMBEDMULITPHOTODOT = ".ar.Mc.RE";
var EMBEDVIDEODOT = ".ar.Mc.bc.kf";
var EMBEDURLTITLEDOT = '.d-s.ot-anchor';
var EMBEDLINKDOT = ".d-s.ot-anchor.zg";
var EMBEDALLPHOTOSDOT = '.d-s.ob.HQhzCd';
var EMBEDPHOTOLINKDOT = '.d-s.ob.Ks';
var EMBEDSIDEPHOTODOT = 'ar.Mc.Nt';
var EMBEDURLTITLEPARENTDOT = '.rCauNb';
var EMBEDURLTITLEPARENTDRIVEDOT = '.iT';
var EMBEDDESCDOT = '.f34nqb';
var EMBEDVIDEOURLTITLEDOT = '.kq.ot-anchor';
// To turn off cursor pointer
var EMBEDPLAYDOT = '.bc.vf';
var EMBEDOVERLAYDOT = '.Rl.RJ';
var EMBEDOVERLAYLINKDOT = '.d-s.ot-anchor.Ks';

// Community
//var COMMUNITYREPOST = 'd-s ob aC5wef';
//var COMMUNITYREPOSTDOT = convertClassFormat(COMMUNITYREPOST);
var COMMUNITYLINKPOST = 'd-s ob Zp';
var COMMUNITYLINKPOSTDOT = convertClassFormat(COMMUNITYLINKPOST);
var COMMUNITYLINKJOINEDDOT = '.d-s.ob.w1d.ATc';
var COMMUNITYIMAGEJOINEDDOT = '.we.photo.z1d';
var COMMUNITYLINKPAGEDOT = '.d-s.ob.U0b.oSb';
var COMMUNITYPAGEURLDOT = '.d-s.ob';
var COMMUNITYRECIMAGEDOT = '.hDc';
var COMMUNITYRECTITLEDOT = '.we.photo.gDc';
var COMMUNITYRECMEMBERSDOT = '.E1d';
var COMMUNITYHOMEMEMBERSDOT = '.Tj6Z6d';
var COMMUNITYJOINEDMEMBERSDOT = '.nZd';
var COMMUNITYPAGEIMAGEDOT = '.we.photo.iFd.V0d';
var COMMUNITYPAGEMEMBERSDOT = '.d-s.ob.Q0d';
var COMMUNITYSIDELINKBASIC = 'd-s ob UCc';
var COMMUNITYSIDELINK = 'd-s ob UCc dke';

// Collections
var COLLECTIONCARD = 'd-s ob rYedS';
var COLLECTIONCARD2 = 'd-s ob fgwINe';

// Decription
var DESCRIPTIONDOT ='.Ct';
var LINKCLASSDOT = '.aaTEdf';
var NORMLINK = 'ot-anchor';
var PROFLINK = 'proflink';
var HASHTAG = 'ot-hashtag';

// Comment
var COMMENTDOT = '.Ik.Wv';

// PostActivity
var SHARECOUNTDOT = '.MM.jI';
var COMMENTCOUNTDOT = '.cr.Rs';
var PLUSCOUNTDOT = '.H3';

// ******************************** //
// **********  Dragging   ********* //
// ******************************** //

//TODO: put REPOSTDOT back in -- out for prototype
// Elements to be set draggable
var draggable = [USERIMAGEPOSTDOT, USERCARDDOT,USERIMAGECOMMENTDOT, USERIMAGEPAGEDOT,USERIMAGESINGLEPOSTDOT, USERIMAGEHOMEDOT,
    POSTDOT, EVENTDOT, EVENTPARENTDOT, EMBEDDOT, EMBEDMULTIDOT, COMMUNITYDOT, COMMUNITYIMAGEHOMEDOT, COMMUNITYJOINEDDOT,
    COMMUNITYPAGEDOT, COMMUNITYPOSTDOT, EMBEDDRIVEDOT]; //, REPOSTDOT

// Elements to be set non-draggable
var nonDraggable = [ USERIMAGECARDDOT, USERIMAGELINKCARDDOT, EMBEDVIDEODOT, EMBEDPHOTODOT, EMBEDMULITPHOTODOT, EMBEDURLTITLEDOT, EMBEDLINKDOT,
    EVENTBANNERIMG, EVENTLINKDOT, COMMUNITYPAGEURLDOT, EMBEDPHOTOLINKDOT, HANGOUTIMAGEDOT, EVENTIMAGEDOT, EMBEDSIDEPHOTODOT,
    REPOSTVIEWORIGDOT, POSTHANGIMAGEDOT, EMBEDOVERLAYDOT, EMBEDOVERLAYLINKDOT ];

var nonXers = [COMMUNITYSIDELINK, COLLECTIONCARD, COLLECTIONCARD2, COMMUNITYSIDELINKBASIC, USERIMAGELINK];
var selectables = [EMBEDDESCDOT, DESCRIPTIONDOT];

var mutationUpdates = [POSTPARENT, EVENTPARENT, USERCARD];

// GxBar Class Constants
var USERTYPE = 'User';
var POSTTYPE = 'Post';
var EVENTTYPE = 'Event';
var HANGOUTTYPE = 'Hangout';
var EMBEDTYPE = 'EmbededElement';
var COMMUNITYTYPE = 'Community';
var FAILTYPE = 'Fail';

var types = [USERTYPE, POSTTYPE, EVENTTYPE, HANGOUTTYPE, EMBEDTYPE, COMMUNITYTYPE];

// Set Class to Type Mapping
var classToType = {};
classToType[USERIMAGEPOST] = USERTYPE;
classToType[USERCARD] = USERTYPE;
classToType[USERIMAGECOMMENT] = USERTYPE;
classToType[USERIMAGEPAGE] = USERTYPE;
classToType[USERIMAGESINGLEPOST] = USERTYPE;
classToType[USERIMAGEHOME] = USERTYPE;
classToType[POST] = POSTTYPE;
classToType[REPOST] = POSTTYPE;
classToType[EVENT] = EVENTTYPE;
classToType[EMBED] = EMBEDTYPE;
classToType[EMBEDDRIVE] = EMBEDTYPE;
classToType[EMBEDMULTI] = EMBEDTYPE;
classToType[COMMUNITY] = COMMUNITYTYPE;
classToType[COMMUNITYJOINED] = COMMUNITYTYPE;
classToType[COMMUNITYPAGE] = COMMUNITYTYPE;
classToType[COMMUNITYIMAGEHOME] = COMMUNITYTYPE;
classToType[COMMUNITYPOST] = COMMUNITYTYPE;
//classToType[COMMUNITYREPOST] = COMMUNITYTYPE;

var typeToImage = {};
typeToImage[USERTYPE] = new Image();
typeToImage[USERTYPE].src = chrome.extension.getURL('../images/user.png');
typeToImage[POSTTYPE] = new Image();
typeToImage[POSTTYPE].src = chrome.extension.getURL('../images/post.png');
typeToImage[EVENTTYPE] = new Image();
typeToImage[EVENTTYPE].src = chrome.extension.getURL('../images/event.png');
typeToImage[HANGOUTTYPE] = new Image();
typeToImage[HANGOUTTYPE].src = chrome.extension.getURL('../images/hangout.png');
typeToImage[EMBEDTYPE] = new Image();
typeToImage[EMBEDTYPE].src = chrome.extension.getURL('../images/embed.png');
typeToImage[COMMUNITYTYPE] = new Image();
typeToImage[COMMUNITYTYPE].src = chrome.extension.getURL('../images/community.png');

var typeToColor = {};
typeToColor[USERTYPE] = '#7d96d1';
typeToColor[POSTTYPE] = '#afc944';
typeToColor[EVENTTYPE] = '#ed366b';
typeToColor[HANGOUTTYPE] = '#ed366b';
typeToColor[EMBEDTYPE] = '#be23ef';
typeToColor[COMMUNITYTYPE] = '#fca53a';
typeToColor[FAILTYPE] = '#424f55';

// ******************************** //
// **********  Parsing   ********** //
// ******************************** //

// User Arrays & Dictionaries

var findLinkOfUser = [ USERIMAGEPOST, USERCARD, USERIMAGECOMMENT, USERIMAGEPAGE, USERIMAGESINGLEPOST, USERIMAGEHOME ];

var getUserLink = {};
getUserLink[USERIMAGEPOST] = USERLINKPOSTDOT;
getUserLink[USERCARD] = USERLINKCARDDOT;
getUserLink[USERIMAGECOMMENT] = USERLINKCOMMENTDOT;
getUserLink[USERIMAGESINGLEPOST] = USERLINKSINGLEPOSTDOT;
getUserLink[USERIMAGEHOME] = LINKHOMEDOT;
getUserLink[USERIMAGEPAGE] = USERPAGENAMEDOT; // Special Case -- class only used to find name of user
getUserLink[USERLINKPOST] = USERIMAGEPOSTDOT;
getUserLink[USERLINKCOMMENT] = USERIMAGECOMMENTDOT;

var userParent = {};
userParent[USERIMAGEPOST] = USERPOSTPARENTDOT;
userParent[USERIMAGECOMMENT] = USERCOMMENTPARENTDOT;
userParent[USERIMAGEHOME] = HOMERECPARENTDOT;
userParent[USERIMAGESINGLEPOST] = USERSINGLEPOSTPARENTDOT;
userParent[USERIMAGEPAGE] = USERPAGEPARENTDOT;

// Community Variables
var communityImages = [ COMMUNITYIMAGEHOME ];
var communityLinks = [ COMMUNITYLINKPOST ];

var communityParentNames = {};
communityParentNames[COMMUNITYIMAGEHOME] = HOMERECPARENTDOT;

var communityFieldToClass = {};
// NOTE: Url is found by Community parent()
communityFieldToClass[COMMUNITY] = new Community({title: COMMUNITYRECIMAGEDOT, image: COMMUNITYRECTITLEDOT, members: COMMUNITYRECMEMBERSDOT});
communityFieldToClass[COMMUNITYIMAGEHOME] = new Community({url: LINKHOMEDOT, title: LINKHOMEDOT, image: COMMUNITYIMAGEHOMEDOT, members: COMMUNITYHOMEMEMBERSDOT});
communityFieldToClass[COMMUNITYJOINED] = new Community({url: COMMUNITYLINKJOINEDDOT, title: COMMUNITYLINKJOINEDDOT, image: COMMUNITYIMAGEJOINEDDOT, members: COMMUNITYJOINEDMEMBERSDOT});
communityFieldToClass[COMMUNITYPAGE] = new Community({url: COMMUNITYPAGEURLDOT, title: COMMUNITYLINKPAGEDOT, image: COMMUNITYPAGEIMAGEDOT, members: COMMUNITYPAGEMEMBERSDOT});
communityFieldToClass[COMMUNITYPOST] = new Community({url: COMMUNITYLINKPOSTDOT, title: COMMUNITYLINKPOSTDOT});