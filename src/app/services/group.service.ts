import { v4 } from "uuid";
import { CreateGroupPayload, IGroup } from "../../domain/models/group";
import { Group } from "../../domain/domain";
import { findUser, userExists } from "./users.service";
import { InvalidInputError, InvalidOperationError, NonExistentResourceError, ServerError } from "../../domain/models/error";
import logger from "../../config/logger";
import { createNotification } from "./notification.service";
import { NotificationType } from "../../domain/models/notification";

// UTILITY

export const sanitizeGroupResponse = (data: any): IGroup => {
    const group: IGroup = {
        uid: data.uid,
        host: data.host,
        members: data.members,
        created: data.created,
        modified: data.modified
    };
    return group;
}

// CREATE

export const createGroup = async (actor: string, data: CreateGroupPayload): Promise<IGroup> => {
    if (data.members.length < 2) throw new InvalidOperationError("Groups cannot have less than two members");
    const hostExists = await userExists(actor, data.host);
    if (!hostExists) throw new NonExistentResourceError("User", data.host);
    let mems: string[] = [];
    data.members.forEach(async (m) => {
        const user = await findUser(actor, m);
        if (!user) throw new NonExistentResourceError("User", m);
        mems.push(user.uid);
    });
    const group = Group.create({
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
    const group = await Group.findOne({ uid: groupId });
    if (!group) throw new NonExistentResourceError("Group", groupId);
    if (group.host != user.uid) throw new InvalidOperationError("Only a group host may invite more users");
    await createNotification(uid, [target], NotificationType.GROUP_INVITE);
    return true;
}

// READ

export const findGroupByUid = async (actor: string, uid: string): Promise<IGroup | undefined> => {
    const group = await Group.findOne({ uid });
    if (!group) return undefined;
    return sanitizeGroupResponse(group);
}

export const findGroupsByUser = async (actor: string, uid: string): Promise<IGroup[]> => {
    const user = await userExists(actor, uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    const groups = await Group.find({
        members: {
            $all: [
                uid
            ]
        }
    });
    return groups.map((group) => sanitizeGroupResponse(group));
}

// DELETE

export const deleteGroup = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await Group.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
