(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[394],{503:function(e,t){!function(e){function t(e,t,a){return{pattern:RegExp("<#"+e+"[\\s\\S]*?#>"),alias:"block",inside:{delimiter:{pattern:RegExp("^<#"+e+"|#>$"),alias:"important"},content:{pattern:/[\s\S]+/,inside:t,alias:a}}}}e.languages["t4-templating"]=Object.defineProperty({},"createT4",{value:function(a){var n=e.languages[a],i="language-"+a;return{block:{pattern:/<#[\s\S]+?#>/,inside:{directive:t("@",{"attr-value":{pattern:/=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/,inside:{punctuation:/^=|^["']|["']$/}},keyword:/\w+(?=\s)/,"attr-name":/\w+/}),expression:t("=",n,i),"class-feature":t("\\+",n,i),standard:t("",n,i)}}}}})}(Prism)}}]);
//# sourceMappingURL=394.22681a12.chunk.js.map