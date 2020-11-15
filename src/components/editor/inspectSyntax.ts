/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */

const CONTENT_DIVIDER_REGEX = /(-{3,})/;
const CONTENT_DIVIDER = '---';

const HASH_TAG_REGEX = /<a[\s]+([^>]+)>(?:.(?!\<\/a\>))*#((?:.(?!\<\/a\>))*.)<\/a>/;
const LABEL_REGEX = /!\[((Common)|(Backend)|(Database)|(Frontend)|(Devops))\]\(https\:\/\/raw.githubusercontent.com\/meotitda\/DICTIONARY\/master\/2TAT1C\/Label_((Common)|(Backend)|(Database)|(Frontend)|(Devops)).png\)/;

const TITLE_REGEX = /\#.*/;
const NON_HASH_TAG_REGEX = /<a[\s]+([^>]+)>(\n?)((?!#).*)((?:.(?!\<\/a\>))*.)<\/a>/;
const NON_EXIST_LABEL_REGEX = /!\[((?!Common)(?!Backend)(?!Database)(?!Frontend)(?!Devops)).*\]\((.*).png\)/;

const cursor : any = {
  totalReadLine: 0,
  position: 0,
  file: null,
  last: {
    label: 0,
    hashTag: 0,
    content: 0
  },
  warning: false
};

const ERROR = {
  NO_TITLE: function() {
    return '❌ 1번 라인에 단어 제목을 반드시 입력하셔야 합니다.';
  },
  NO_CONTENT: function () {
    return `
    ❌ ${CONTENT_DIVIDER}는 필수 값입니다.
   Content를 나누기 위해 하나 이상 이용하시길 바랍니다.
   `;
  },
  NON_EXIST_LABEL_ERROR: function (label: any) {
    return `
    ❌ ${label}는 존재하지 않는 라벨명입니다.
   `;
  },
  NON_EXIST_HASH_ERROR: function (hash: any) {
    return `
    ❌ 관련태그 ${hash}에 #는 필수입니다.
   `;
  }
};

const WARNING = {
  NON_EXIST_LABEL_WARNING: function () {
    return `
   ⚠️ 라벨이 존재하지 않습니다.
   `;
  },
  NON_EXIST_HASH_WARNING: function () {
    return `
   ⚠ 관련 태그가 존재 하지 않습니다.
   `;
  }
};

export function inspectSyntax(text: string = '') {
  const errors: any = [];
  const lines = nomalizedText(text);
  const titleErrors = inspectTitle(lines[0]);
  const labelErrors = inspectLabel(lines);
  const hashTagErrors = inspectHashtag(lines);
  const contentErrors = inspectContent(lines);
  return errors.concat(titleErrors, labelErrors, hashTagErrors, contentErrors).filter((error: any) => error);
}

function inspectTitle(line: any) {
  if (!line) {
    return [{ error: ERROR.NO_TITLE(), line: 1 }];
  }
  const title = line.match(TITLE_REGEX);
  if (!title || (title && title[0].length <= 1)) {
    return [{ error: ERROR.NO_TITLE(), line: 1 }];
  }
}

function inspectLabel(lines: any) : any[] {
  const errors: any[] = [];
  let isFindLabel = false;

  lines.map((line: any, index: any) => {
    const matched = line.match(LABEL_REGEX);
    if (matched) {
      isFindLabel = true;
    }
    const nonExistedMatch = line.match(NON_EXIST_LABEL_REGEX);
    if (nonExistedMatch) {
      errors.push({
        error: ERROR.NON_EXIST_LABEL_ERROR(nonExistedMatch[0]),
        line: index
      });
    }
  });

  if (!isFindLabel) {
    errors.push({ warning: WARNING.NON_EXIST_LABEL_WARNING() });
  }

  cursor.last.label = cursor.position;
  return errors;
}

function inspectHashtag(lines: any):any {
  const errors : any[] = [];
  let isFindHash = false;

  lines.map((line:any, index: any) : any => {
    const matched = line.match(HASH_TAG_REGEX);
    if (matched) {
      isFindHash = true;
    }

    const nonExistedMatch = line.match(NON_HASH_TAG_REGEX);

    if (nonExistedMatch) {
      errors.push({ error: ERROR.NON_EXIST_HASH_ERROR(nonExistedMatch[0]), line: index });
    }
  });

  if (!isFindHash) {
    errors.push({ warning: WARNING.NON_EXIST_HASH_WARNING() });
  }

  return errors;
}

function inspectContent(lines: any) {
  const errors = [];
  resetCursorPosition();
  let isFindContentEdge = false;
  lines.map((line: any, index: any) => {
    if (line.match(CONTENT_DIVIDER_REGEX)) {
      isFindContentEdge = true;
    }
  });
  if (!isFindContentEdge) {
    errors.push({ error: ERROR.NO_CONTENT() });
  }

  return errors;
}

function resetCursorPosition() {
  cursor.position = 0;
}

export function nomalizedText(text: any) {
  const rowLines = text.split('\n');
  const filteredLines = rowLines.filter((line: any) => line !== '');
  return filteredLines.map((filteredLine: any) => filteredLine.trim());
}
