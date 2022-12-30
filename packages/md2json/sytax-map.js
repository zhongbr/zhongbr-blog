export const ASTNodeTypes = {
    Document : "Document",
    DocumentExit : "Document:exit",
    Paragraph : "Paragraph",
    ParagraphExit : "Paragraph:exit",
    BlockQuote : "BlockQuote",
    BlockQuoteExit : "BlockQuote:exit",
    ListItem : "ListItem",
    ListItemExit : "ListItem:exit",
    List : "List",
    ListExit : "List:exit",
    Header : "Header",
    HeaderExit : "Header:exit",
    CodeBlock : "CodeBlock",
    CodeBlockExit : "CodeBlock:exit",
    HtmlBlock : "HtmlBlock",
    HtmlBlockExit : "HtmlBlock:exit",
    HorizontalRule : "HorizontalRule",
    HorizontalRuleExit : "HorizontalRule:exit",
    Comment : "Comment",
    CommentExit : "Comment:exit",
    /**
     * @deprecated
     */
    ReferenceDef : "ReferenceDef",
    /**
     * @deprecated
     */
    ReferenceDefExit : "ReferenceDef:exit",
    // inline
    Str : "Str",
    StrExit : "Str:exit",
    Break : "Break", // well-known Hard Break
    BreakExit : "Break:exit", // well-known Hard Break
    Emphasis : "Emphasis",
    EmphasisExit : "Emphasis:exit",
    Strong : "Strong",
    StrongExit : "Strong:exit",
    Html : "Html",
    HtmlExit : "Html:exit",
    Link : "Link",
    LinkExit : "Link:exit",
    Image : "Image",
    ImageExit : "Image:exit",
    Code : "Code",
    CodeExit : "Code:exit",
    Delete : "Delete",
    DeleteExit : "Delete:exit",
    InlineMath: "InlineMath",
    Math: "Math"
}

export const SyntaxMap = {
    root: ASTNodeTypes.Document,
    paragraph: ASTNodeTypes.Paragraph,
    blockquote: ASTNodeTypes.BlockQuote,
    listItem: ASTNodeTypes.ListItem,
    list: ASTNodeTypes.List,
    Bullet: "Bullet", // no need?
    heading: ASTNodeTypes.Header,
    code: ASTNodeTypes.CodeBlock,
    HtmlBlock: ASTNodeTypes.HtmlBlock,
    thematicBreak: ASTNodeTypes.HorizontalRule,
    // inline block
    text: ASTNodeTypes.Str,
    break: ASTNodeTypes.Break,
    emphasis: ASTNodeTypes.Emphasis,
    strong: ASTNodeTypes.Strong,
    html: ASTNodeTypes.Html,
    link: ASTNodeTypes.Link,
    image: ASTNodeTypes.Image,
    inlineCode: ASTNodeTypes.Code,
    delete: ASTNodeTypes.Delete,
    // remark(markdown) extension
    // Following type is not in @textlint/ast-node-types
    yaml: "Yaml",
    table: "Table",
    tableRow: "TableRow",
    tableCell: "TableCell",
    linkReference: "LinkReference",
    imageReference: "ImageReference",
    footnoteReference: "FootnoteReference", // textlint@12+
    definition: "Definition",
    /**
     * @deprecated
     */
    ReferenceDef: ASTNodeTypes.ReferenceDef,
    inlineMath: ASTNodeTypes.InlineMath,
    math: ASTNodeTypes.Math
}
