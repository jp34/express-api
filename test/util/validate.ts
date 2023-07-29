import should from "should";

export const validateAuthResponse = (data: any): Boolean => {
    const validTokens = validateTokenResponse(data.tokens);
    const validAccount = validateAccountResponse(data.account);
    return (validAccount && validTokens);
}

export const validateTokenResponse = (tokens: any) => {
    should.exist(tokens);
    tokens.access.should.be.String();
    tokens.refresh.should.be.String();
    return true;
}

export const validateAccountResponse = (account: any) => {
    should.exist(account);
    should.not.exist(account._id);
    should.not.exist(account.__v);
    account.uid.should.be.String();
    account.email.should.be.String();
    account.password.should.be.String();
    account.name.should.be.String();
    account.phone.should.be.String();
    account.birthday.should.be.String();
    account.hasUser.should.be.Boolean();
    account.isVerified.should.be.Boolean();
    account.isLocked.should.be.Boolean();
    account.dateCreated.should.be.String();
    account.dateModified.should.be.String();
    return true;
}

export const validateUserResponse = (user: any) => {
    should.exist(user);
    should.not.exist(user._id);
    should.not.exist(user.__v);
    user.uid.should.be.String();
    user.username.should.be.String();
    user.interests.should.be.Array();
    user.friends.should.be.Array();
    user.groups.should.be.Array();
    user.inbox.should.be.Array();
    user.isOnline.should.be.Boolean();
    user.isActive.should.be.Boolean();
    user.dateCreated.should.be.String();
    user.dateModified.should.be.String();
    return true;
}

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
