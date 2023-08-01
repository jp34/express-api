import { v4 } from "uuid";
import { Group, GroupModel, CreateGroupPayload } from "../../domain/entity/group";
import { findUser, findUserExists } from "./users.service";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import { createNotification } from "./notification.service";
import { NotificationType } from "../../domain/entity/notification";

export const createGroup = async (actor: string, payload: CreateGroupPayload): Promise<Group> => {
    if (payload.members.length < 2) throw new InvalidOperationError("Groups cannot have less than two members");
    // Verify host user exists
    const hostExists = await findUserExists(actor, { uid: payload.host });
    if (!hostExists) throw new NonExistentResourceError("User", payload.host);
    let mems: string[] = [];
    payload.members.forEach(async (m) => {
        // Verify each member user exists
        const user = await findUser(actor, { uid: m });
        if (!user) throw new NonExistentResourceError("User", m);
        if (user.uid) mems.push(user.uid);
    });
    const group = await GroupModel.create({
        uid: v4(),
        host: payload.host,
        members: mems,
    });
    await createNotification(actor, {
        notifiers: mems,
        type: NotificationType.GROUP_INVITE
    });
    return group;
}

export const inviteToGroup = async (actor: string, uid: string, groupId: string, target: string): Promise<Boolean> => {
    const user = await findUser(actor, { uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    const t = await findUser(actor, { uid });
    if (!t) throw new NonExistentResourceError("User", target);
    const group = await GroupModel.findOne({ uid: groupId });
    if (!group) throw new NonExistentResourceError("Group", groupId);
    if (group.host != user.uid) throw new InvalidOperationError("Only a group host may invite more users");
    await createNotification(uid, {
        notifiers: [target],
        type: NotificationType.GROUP_INVITE
    });
    return true;
}

export const findGroupByUid = async (actor: string, uid: string): Promise<Group> => {
    const group = await GroupModel.findOne({ uid });
    if (!group) throw new NonExistentResourceError("group", uid);
    return group;
}

export const findGroupsByUser = async (actor: string, uid: string): Promise<Group[]> => {
    const user = await findUserExists(actor, { uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    return await GroupModel.find({
        members: {
            $all: [
                uid
            ]
        }
    });
}

export const deleteGroup = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await GroupModel.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
