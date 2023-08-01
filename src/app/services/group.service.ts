import { v4 } from "uuid";
import { Group, GroupModel, CreateGroupPayload } from "../../domain/entity/group";
import { findUser, findUserExists } from "./user.service";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import { createNotification } from "./notification.service";
import { NotificationType } from "../../domain/entity/notification";

export const createGroup = async (actor: string, payload: CreateGroupPayload): Promise<Group> => {
    if (payload.members.length < 2) throw new InvalidOperationError("Groups cannot have less than two members");
    // Verify host user exists
    const hostExists = await findUserExists(actor, { _id: payload.host });
    if (!hostExists) throw new NonExistentResourceError("User", payload.host);
    let mems: string[] = [];
    payload.members.forEach(async (m) => {
        // Verify each member user exists
        const user = await findUser(actor, { _id: m });
        if (!user) throw new NonExistentResourceError("User", m);
        if (user._id) mems.push(user._id);
    });
    const group = await GroupModel.create({
        _id: v4(),
        host: payload.host,
        members: mems,
    });
    await createNotification(actor, {
        notifiers: mems,
        type: NotificationType.GROUP_INVITE
    });
    return group;
}

export const inviteToGroup = async (actor: string, _id: string, groupId: string, target: string): Promise<Boolean> => {
    const user = await findUser(actor, { _id });
    if (!user) throw new NonExistentResourceError("User", _id);
    const t = await findUser(actor, { _id });
    if (!t) throw new NonExistentResourceError("User", target);
    const group = await GroupModel.findOne({ _id: groupId });
    if (!group) throw new NonExistentResourceError("Group", groupId);
    if (group.host != user._id) throw new InvalidOperationError("Only a group host may invite more users");
    await createNotification(_id, {
        notifiers: [target],
        type: NotificationType.GROUP_INVITE
    });
    return true;
}

export const findGroupByid = async (actor: string, _id: string): Promise<Group> => {
    const group = await GroupModel.findOne({ _id });
    if (!group) throw new NonExistentResourceError("group", _id);
    return group;
}

export const findGroupsByUser = async (actor: string, _id: string): Promise<Group[]> => {
    const user = await findUserExists(actor, { _id });
    if (!user) throw new NonExistentResourceError("User", _id);
    return await GroupModel.find({
        members: {
            $all: [
                _id
            ]
        }
    });
}

export const deleteGroup = async (actor: string, _id: string): Promise<Boolean> => {
    const result = await GroupModel.deleteOne({ _id });
    return (result.acknowledged && (result.deletedCount == 1));
}
