import { Context, Schema } from 'koishi';
export declare const name = "idiom-solitaire";
export declare const usage = "\n\n\u53D1\u9001 [\u6210\u8BED\u63A5\u9F99 \u56DB\u5B57\u6210\u8BED] \u6216\u76F4\u63A5\u53D1 [\u6210\u8BED\u63A5\u9F99] \u6765\u5F00\u59CB\u6E38\u620F\n\n\u6CE8\u610F\u4E0D\u8981\u7528 \u4E00\u4E2A\u9876\u4FE9 \u6216\u8005 \u4E3A\u6240\u6B32\u4E3A \u54E6~\n\n";
export interface Config {
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
export declare function getTextBetweenMarkers(str: string, marker1: string, marker2: string): string | null;
export declare function extractTextBetweenMarkers(str: string, marker1: string, marker2: string): string[];
export declare function excludeString(mainStr: string, excludeStr: string): string;
