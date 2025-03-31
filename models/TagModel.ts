export interface Tag {
    tagID: number,
    tagLabel: string,
    //tagColor: TagColor
}

export class Tag {
    constructor(public tagID: number, public tagLabel: string) {}
}