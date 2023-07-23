import { v4 } from "uuid";
import { GroupModel, Group, CreateGroupPayload } from "../../domain/entity/group";
import { findUser, userExists } from "./users.service";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/entity/error";
import { createNotification } from "./notification.service";
import { NotificationType } from "../../domain/entity/notification";

// ---- Utility ------------

export const sanitizeGroupResponse = (data: any): Group => {
    const group: Group = {
        uid: data.uid,
        host: data.host,
        members: data.members,
        created: data.created,
        modified: data.modified
    };
    return group;
}

// ---- Group ------------

export const createGroup = async (actor: string, data: CreateGroupPayload): Promise<Group> => {
    if (data.members.length < 2) throw new InvalidOperationError("Groups cannot have less than two members");
    const hostExists = await userExists(actor, data.host);
    if (!hostExists) throw new NonExistentResourceError("User", data.host);
    let mems: string[] = [];
    data.members.forEach(async (m) => {
        const user = await findUser(actor, m);
        if (!user) throw new NonExistentResourceError("User", m);
        mems.push(user.uid);
    });
    const group = GroupModel.create({
        uid: v4(),
        host: data.host,
        members: mems,
    });
    await createNotification(data.host, mems, NotificationType.GROUP_INVITE);
    return sanitizeGroupResponse(group);
}

export const inviteToGroup = async (actor: string, uid: string, groupId: string, target: string): Promise<Boolean> => {
    const user = await findUser(actor, uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    const t = await findUser(actor, uid);
    if (!t) throw new NonExistentResourceError("User", target);
    const group = await GroupModel.findOne({ uid: groupId });
    if (!group) throw new NonExistentResourceError("Group", groupId);
    if (group.host != user.uid) throw new InvalidOperationError("Only a group host may invite more users");
    await createNotification(uid, [target], NotificationType.GROUP_INVITE);
    return true;
}

export const findGroupByUid = async (actor: string, uid: string): Promise<Group | undefined> => {
    const group = await GroupModel.findOne({ uid });
    if (!group) return undefined;
    return sanitizeGroupResponse(group);
}

export const findGroupsByUser = async (actor: string, uid: string): Promise<Group[]> => {
    const user = await userExists(actor, uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    const groups = await GroupModel.find({
        members: {
            $all: [
                uid
            ]
        }
    });
    return groups.map((group) => sanitizeGroupResponse(group));
}

export const deleteGroup = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await GroupModel.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
