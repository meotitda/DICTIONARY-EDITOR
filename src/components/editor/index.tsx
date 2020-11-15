import React, { useEffect, useState } from 'react';
import MDEditor, { commands, ICommand, TextState, TextApi } from '@uiw/react-md-editor';
import { debounce } from 'lodash';
import 'easymde/dist/easymde.min.css';
import copy from 'copy-to-clipboard';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import '../../../src/App.css';
import { inspectSyntax } from './inspectSyntax';

const title: ICommand = {
  name: 'title',
  keyCommand: 'title',
  buttonProps: { 'aria-label': 'Insert Title' },
  icon: (
    <span>
      단어 제목
    </span>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `# ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = '# 제목을 입력하세요\n';
    }
    api.replaceSelection(modifyText);
  }
};

const hashTag: ICommand = {
  name: 'hash',
  keyCommand: 'hash',
  buttonProps: { 'aria-label': 'hash Title' },
  icon: (
    <span>
      관련 태그
    </span>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `<a href="#">#${state.selectedText}</a>\n`;
    if (!state.selectedText) {
      modifyText = '<a href="#">#관련 태그</a>\n';
    }
    api.replaceSelection(modifyText);
  }
};

const contnet: ICommand = {
  name: 'hash',
  keyCommand: 'hash',
  buttonProps: { 'aria-label': 'hash Title' },
  icon: (
    <span>
      내용
    </span>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `--- \n${state.selectedText} \n`;
    if (!state.selectedText) {
      modifyText = '\n---\n';
    }
    api.replaceSelection(modifyText);
  }
};

function getUrlParams(): any {
  const params: any = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value): any { params[key] = value; });
  return params;
}

function getBase() {
  const querystring = getUrlParams();
  return `# ${querystring.word || '예제'}
  
![Common](https://raw.githubusercontent.com/meotitda/DICTIONARY/master/2TAT1C/Label_Common.png)
![Backend](https://raw.githubusercontent.com/meotitda/DICTIONARY/master/2TAT1C/Label_Backend.png)

<a href="https://github.com/meotitda/DICTIONARY">#딕셔너리</a>
<a href="#">#멋</a>
  
---
  
딕셔너리 예제입니다!
  
`;
}

function getLabel(label: string): commands.ICommand {
  return {
    name: label,
    keyCommand: label,
    buttonProps: { 'aria-label': `Insert ${label}` },
    icon: (
      <span>
        {label}
      </span>
    ),

    execute: (state: TextState, api: TextApi) => {
      const modifyText = `![${label}](https://raw.githubusercontent.com/meotitda/DICTIONARY/master/2TAT1C/Label_${label}.png)\n`;
      api.replaceSelection(modifyText);
    }
  };
}

const debounceInspectError = debounce((value: any, setErrors: any) => {
  setErrors(inspectSyntax(value));
}, 500);

function Editor() {
  const [value, setValue]: any = useState(getBase());
  const [errors, setErrors]: any = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [last, setLast]: any = useState(false);

  useEffect(() => {
    debounceInspectError(value, setErrors);
    setLast((last: boolean) => !last);
  }, [value]);

  console.log(errors);

  return (
    <>
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <MDEditor
              value={value}
              onChange={setValue}
              height={'100%'}
              preview={'edit'}
              commands={[
                title,
                commands.divider,

                getLabel('Common'),
                getLabel('Frontend'),
                getLabel('Backend'),
                getLabel('Database'),
                getLabel('Devops'),
                commands.divider,

                hashTag,
                commands.divider,

                contnet,
                commands.divider,

                commands.bold,
                commands.divider,
                commands.image,
                commands.divider,
                commands.link,
                commands.divider
              ]}
            />
          </div>
          <div style={{ padding: 10, borderRadius: 4, width: '100%', border: '2px solid #d3d3d3', marginLeft: '40px' }}>
            <ReactMarkdownWithHtml allowDangerousHtml plugins={[gfm]} children={value} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginTop: 20, padding: 10, borderRadius: 4, width: '100%', height: '100px', border: '2px solid #d3d3d3' }}>
            {errors && errors.length && errors.map((error:any, index:number) => (
              <>
              {error?.error && <div className="error" >{error?.error} (line:{error?.line})</div>}
              {error?.warning && <div className="warning" >{error?.warning} (line:{error?.line})</div>}
              </>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            className="copybutton"
            onClick={() => {
              const text = value;

              if (errors?.errors?.length) {
                alert('');
              }

              copy(text);
            }}>
            <span>
              복사하기
          </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editor;
