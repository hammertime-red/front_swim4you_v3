export function isExternalLink(url: string): boolean {
    // Проверяем, начинается ли ссылка с http, https или www
    return /^https?:\/\/|www\./.test(url);
}