import React, { useEffect, useState } from 'react';
import MDEditor, { commands, ICommand, TextState, TextApi } from '@uiw/react-md-editor';
import { debounce } from 'lodash';
import 'easymde/dist/easymde.min.css';
import copy from 'copy-to-clipboard';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../../src/App.css';
import { inspectSyntax, nomalizedText } from './inspectSyntax';

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
  const titleErrorToast = () => {
    toast.error('❌ 단어 제목이 존재해야합니다!', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };
  const errorToast = () => {
    toast.error('❌ Error exist!', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };
  const successToast = () => {
    toast.success('✔️ 복사되었습니다.!', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  useEffect(() => {
    debounceInspectError(value, setErrors);
  }, [value]);

  return (
    <>
    <>
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '50vw' }}>
            <MDEditor
              value={value}
              onChange={setValue}
              previewOptions ={{
                skipHtml: false
              } as any }

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
          <div style={{ top: 0, right: 20, width: '50vw', overflow: 'auto', padding: 10, borderRadius: 4, border: '2px solid #d3d3d3', marginLeft: '40px' }}>
            <ReactMarkdownWithHtml allowDangerousHtml plugins={[gfm]} children={value} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', marginTop: 20, bottom: 20, padding: 10, borderRadius: 4, height: '100px', border: '2px solid #d3d3d3' }}>
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
              const onlyErrors = errors?.filter((error: any) => error.error);
              if (onlyErrors.length) {
                errorToast();
              } else {
                const text = value;
                copy(text);
                successToast();
              }
            }}>
            <span>
              복사하기
          </span>
          </div>
           <a
            className="contribute"
            onClick={() => {
              const titleKeyword = nomalizedText(value)[0].indexOf('#');
              const title = nomalizedText(value)[0].split('# ')[1];

              console.log(title);

              if (titleKeyword < 0) {
                titleErrorToast();
                return;
              }

              if (!nomalizedText(value)[0].split('#')[1].trim()[0]) {
                titleErrorToast();
                return;
              }
              const prefix = nomalizedText(value)[0].split('#')[1].trim()[0].toUpperCase();
              window.open(`https://github.com/meotitda/DICTIONARY/new/master/DIC/${prefix}/doop?filename=${title}.md&value=${encodeURIComponent(value)}`);
            }}>
            <span>
              단어 등록 하러가기
          </span>
          </a>
        </div>
      </div>
      </>
      <ToastContainer
position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
    </>
  );
}

export default Editor;
