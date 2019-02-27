exports.cutTextHead = (head, raw) => {
    return raw.substring(head.length, raw.length);
};
exports.argsParse = (command, raw) => {
    // 보통 command 매개변수에 ifComamndEquals~의 expected를 넣습니다.
    // 보통 raw 매개변수에 ifComamndEquals~의 command를 넣습니다.
    // 이것은 Array를 반환합니다.
    // 인자는 0부터 시작합니다.
    return exports.cutTextHead(command + " ", raw).split(" ");
};