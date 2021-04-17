import {create, updateTag, update, deleteNote, getList} from './note.controller';
import {noteCreate, noteFilter, noteUpdateTag} from "./note.validate";

export const noteRoutes = (router) => {
    router.get("/", noteFilter, getList)
        .post("/", noteCreate, create)
        .patch('/update-tag/:id', noteUpdateTag, updateTag)
        .delete("/:id", deleteNote)
    return router;
}