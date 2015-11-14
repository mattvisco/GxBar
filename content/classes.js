/**
 * Created by M on 7/31/15.
 */

var DragElement = function(options) {
    this.target = options['target'];
    this.targetClass = options['targetClass'];
    this.type = options['type'];
    this.id = options['id'];
    this.parser = parser;
};

var User = function(options) {
    this.image = options['image'];
    this.url = options['url'];
    this.title = options['title'];
    this.story = options['story'];
    this.work = options['work'];
    this.education = options['education'];
    this.basic = options['basic'];
    this.contact = options['contact'];
};

var Story = function(options) {
    this.tagline = options['tagline'];
    this.introduction = options['introduction'];
    this.brag = options['brag'];
};

var Work = function(options) {
    this.occupation = options['occupation'];
    this.skills = options['skills'];
    this.employment = options['employment'];
};

var Education = function(options) {
    this.degrees = options['degrees'];
};

var Degree = function(options) {
    this.school = options['school'];
    this.info = options['info'];
}

var Basic = function(options) {
    this.gender = options['gender'];
    this.birthday = options['birthday'];
    this.looking = options['looking'];
    this.relationship = options['relationship'];
};

var Contact = function(options) {
    this.home = options['home'];
    this.work = options['work'];
    this.contact = options['contact'];
};

var ContactInfo = function(options) {
    this.type = options['type'];
    this.value = options['value'];
};

var Post = function(options) {
    // Relation to the User class
    this.user = options['user'];
    // Relation to javascript Date Obj (can be interepreted as String)
    this.date = options['date'];
    // Relation to a value
    this.url = options['url'];
    // Relation to the Description class
    this.desc = options['description'];
    // Relation to the EmbededElement class
    this.embededEl = options['embededEl'];
    // Relation to the Post class
    this.repostedPost = options['repostedPost'];
    // Relation to the PostActivity class
    this.postActivity = options['postActivity'];
    // Relation to many Comment classes
    this.comments = options['comments'];
    // Relation to the Community class
    this.community = options['community'];
};

var Event = function(options) {
    Post.call(this, options);
    this.title = options['title'];
};

var Hangout = function(options) {
    Event.call(this, options);
};

var Description = function(options) {
    this.html = options['html'];
    this.text = options['text'];
    this.links = options['links'];
    this.profLinks = options['profLinks'];
    this.hashTags = options['hashTags'];
};

var Link = function(options) {
    this.url = options['url'];
    this.title = options['title'];
};

var HashTag = function(options) {
    Link.call(this, options);
};

var ProfLink = function(options) {
    Link.call(this, options);
};

var EmbededElement = function(options){
    this.images = options['images'];
    this.url = options['url']; // Saves article link, photo link, or video link
    this.title = options['title'];
    this.desc = options['description'];
};

var PostActivity = function(options){
    this.plus = options['plusCount'];
    this.comments = options['commentCount'];
    this.shares = options['shareCount'];
};

var Comment = function(options){
    this.user = options['user'];
    this.desc = options['description'];
};

var Community = function(options) {
    this.url = options['url'];
    this.title = options['title'];
    this.image = options['image'];
    this.members = options['members'];
};

