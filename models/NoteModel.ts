export interface Note {
    noteID: number;
    noteContent: string | null;
    pageID: number;
}

export class Note {
    constructor(public noteID: number, public noteContent: string | null, public pageID: number) {}
}