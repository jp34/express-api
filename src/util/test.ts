import should from "should";

// Account response validator

export const validateAccountResponse = (account: any) => {
    should.exist(account);
    should.not.exist(account._id);
    should.not.exist(account.__v);
    should.not.exist(account.password);
    account.uid.should.be.String();
    account.email.should.be.String();
    account.name.should.be.String();
    account.phone.should.be.String();
    account.birthday.should.be.String();
    account.verified.should.be.Boolean();
    account.locked.should.be.Boolean();
    account.created.should.be.String();
    account.modified.should.be.String();
    return true;
}

// Auth Response Validators

export const validateTokenResponse = (tokens: any) => {
    should.exist(tokens);
    tokens.access.should.be.String();
    tokens.refresh.should.be.String();
    return true;
}

// User Response Validators

export const validateUserResponse = (user: any) => {
    should.exist(user);
    should.not.exist(user._id);
    should.not.exist(user.__v);
    user.uid.should.be.String();
    user.username.should.be.String();
    user.interests.should.be.Array();
    user.online.should.be.Boolean();
    user.active.should.be.Boolean();
    user.created.should.be.String();
    user.modified.should.be.String();
    return true;
}

// Tag Respose Validators

export const validateTagResponse = (tag: any) => {
    should.exist(tag);
    should.not.exist(tag._id);
    should.not.exist(tag.__v);
    tag.name.should.be.String();
    tag.label.should.be.String();
    tag.parent.should.be.String();
    tag.ref.should.be.String();
    return true;
}
