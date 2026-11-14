(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* Навигация по вкладкам (только hash вида #name) */
var PAGES=['home','steps','docs','effects','sources'];
var TITLES={home:'Главная',steps:'Пошаговая инструкция',docs:'Чек-лист документов',effects:'Правовые последствия',sources:'Оговорка и первоисточники'};
function show(id,focus){
  if(PAGES.indexOf(id)<0)id='home';
  $$('.page').forEach(function(s){s.hidden=s.id!==id});
  $$('.tabs a').forEach(function(a){if(a.dataset.p===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.title=TITLES[id]+' — Эмансипация в РК';
  if(focus){var h=$('#'+id+' h1');h.tabIndex=-1;h.focus({preventScroll:true});window.scrollTo(0,0)}
}
window.addEventListener('hashchange',function(){show(location.hash.slice(1),true)});
show(location.hash.slice(1),false);

/* Тема */
var root=document.documentElement,btn=$('#themeBtn');
function isDark(){var t=root.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function label(){btn.textContent=isDark()?'Светлая тема':'Тёмная тема'}
btn.addEventListener('click',function(){var t=isDark()?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}label()});
label();

/* Мини-вопрос о причине (ничего не сохраняется и не отправляется) */
var WHY={
  money:['Самостоятельные сделки и деньги','С 14 лет вы уже сами распоряжаетесь заработком, стипендией и иными доходами (ст. 22, п. 2), но остальные сделки совершаете с согласия законных представителей (ст. 22, п. 1). После эмансипации вы обладаете гражданскими правами и несёте обязанности, в том числе по обязательствам из причинения вреда (ст. 22-1, п. 3). Для эмансипации всё равно нужно основание: работа по трудовому договору или предпринимательство.'],
  biz:['Предпринимательство','Это одно из двух оснований: предпринимательская деятельность с согласия законных представителей (ст. 22-1, п. 1). Регистрация ИП проходит по Предпринимательскому кодексу (ст. 19 ГК РК). Без согласия законных представителей этот путь под вопросом: проконсультируйтесь с юристом.'],
  work:['Работа по трудовому договору','Это прямое основание: работа по трудовому договору (ст. 22-1, п. 1). Согласие законных представителей определяет, кто решает: орган опеки или суд (ст. 22-1, п. 2).'],
  family:['Выход из-под контроля родителей','Ст. 22-1 говорит о полной гражданской дееспособности: сделки, обязательства, ответственность. Законные представители при этом не отвечают по вашим обязательствам. Других последствий в этой статье нет, поэтому, если причина в отношениях в семье, эмансипация может её не решить. Обсудите ситуацию с юристом или другим взрослым, которому доверяете.'],
  other:['Причина не является условием','В ст. 22-1 условия такие: вам 16 лет и есть основание (трудовой договор или предпринимательство). Причина как условие не названа. Пройдите проверку, чтобы понять, подходите ли вы.']
};
$$('#why input').forEach(function(i){i.addEventListener('change',function(){
  var o=$('#whyOut'),d=WHY[i.value];o.textContent='';
  var b=document.createElement('div'),h=document.createElement('h2'),p=document.createElement('p'),a=document.createElement('a');
  b.className='verdict';h.textContent=d[0];p.textContent=d[1];
  a.className='btn alt';a.href='#docs';a.textContent='Проверить условия и собрать документы';
  b.appendChild(h);b.appendChild(p);b.appendChild(a);o.appendChild(b);
})});

/* Переключатель пути в инструкции */
function setRoute(r){
  $$('[data-route]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.route===r))});
  $('#route-guardian').hidden=r!=='guardian';$('#route-court').hidden=r!=='court';
}
$$('[data-route]').forEach(function(b){b.addEventListener('click',function(){setRoute(b.dataset.route)})});

/* Ссылки на 2ГИС (обычные ссылки, без виджетов) */
function maps(){
  var c=$('#city').value,b='https://2gis.kz/'+(c?c+'/':'')+'search/';
  $('#mapOpeka').href=b+encodeURIComponent('отдел образования');
  $('#mapCourt').href=b+encodeURIComponent('суд по делам несовершеннолетних');
}
$('#city').addEventListener('change',maps);maps();

/* Чек-лист */
var N1='норма: ст. 22-1 ГК РК',UT='уточнить на месте';
var DOCS={
  id:{t:'Документ, удостоверяющий личность несовершеннолетнего',g:UT},
  appG:{t:'Письменное заявление несовершеннолетнего в орган опеки и попечительства',g:UT},
  appC:{t:'Заявление в суд об объявлении несовершеннолетнего полностью дееспособным',g:'норма: ст. 329 ГПК РК'},
  work:{t:'Трудовой договор (копия, заверенная работодателем)',g:N1+', п. 1'},
  workDoc:{t:'Справка с места работы о том, что договор действует',g:UT},
  ip:{t:'Документ, подтверждающий регистрацию в качестве ИП',g:N1+', п. 1; ст. 19 ГК РК'},
  ipOk:{t:'Письменное согласие законных представителей на занятие предпринимательством',g:N1+', п. 1'},
  consent:{t:'Письменное согласие законных представителей на эмансипацию',g:N1+', п. 2'},
  repId:{t:'Документы, удостоверяющие личность законных представителей',g:UT},
  repStatus:{t:'Документы, подтверждающие статус усыновителя или попечителя (если применимо)',g:UT},
  noConsent:{t:'Подтверждение, что согласия нет (например, письменный отказ)',g:'норма: ст. 329 ГПК РК'}
};
var ans={},ticked={};
function build(){
  var path=ans.consent==='no'?'court':'guardian',k=['id',path==='court'?'appC':'appG'];
  k.push(ans.basis==='work'?'work':'ip');
  k.push(ans.basis==='work'?'workDoc':'ipOk');
  if(path==='guardian')k.push('consent','repId','repStatus');else k.push('noConsent');
  return {path:path,keys:k};
}
function verdict(){
  var a=ans;
  if(a.age==='lt16')return {c:'bad',h:'Пока рано',p:['Эмансипация возможна с 16 лет (ст. 22-1, п. 1 ГК РК).','До этого вы вправе распоряжаться заработком, но сделки совершаете с согласия законных представителей (ст. 22 ГК РК).']};
  if(a.age==='ge18')return {c:'ok',h:'Эмансипация не нужна',p:['С 18 лет полная дееспособность наступает по общему правилу (ст. 17 ГК РК).']};
  if(a.age!=='mid'||!a.basis)return null;
  if(a.basis==='none')return {c:'bad',h:'Условия пока не выполнены',p:['Нужно основание: работа по трудовому договору или предпринимательство с согласия законных представителей (ст. 22-1, п. 1).']};
  if(!a.consent)return null;
  return {c:'go'};
}
function render(){
  var out=$('#result'),v=verdict();out.textContent='';
  if(!v)return;
  var box=document.createElement('div');
  if(v.c!=='go'){
    box.className='verdict '+(v.c==='bad'?'bad':'');
    box.innerHTML='<h2></h2>';$('h2',box).textContent=v.h;
    v.p.forEach(function(t){var p=document.createElement('p');p.textContent=t;box.appendChild(p)});
    out.appendChild(box);return;
  }
  var b=build(),warn=[];
  if(ans.consent==='unknown')warn.push('Сначала выясните, согласны ли все законные представители: от этого зависит, куда обращаться. Ниже показан путь через орган опеки.');
  if(ans.basis==='ip'&&ans.consent!=='yes')warn.push('Для основания «ИП» п. 1 ст. 22-1 требует согласия законных представителей на предпринимательство. Без него выполнение условий под вопросом: проконсультируйтесь с юристом.');
  box.className='verdict'+(warn.length?' warn':'');
  box.innerHTML='<h2></h2><p></p>';
  $('h2',box).textContent=b.path==='court'?'Ваш путь: через суд':'Ваш путь: через орган опеки и попечительства';
  $('p',box).textContent=b.path==='court'?'Условия выглядят выполнимыми. Без согласия законных представителей решает суд (ст. 22-1, п. 2).':'Условия выглядят выполнимыми. С согласием законных представителей решает орган опеки (ст. 22-1, п. 2).';
  warn.forEach(function(t){var p=document.createElement('p');p.textContent=t;p.style.fontWeight='600';box.appendChild(p)});
  var a=document.createElement('a');a.className='btn alt';a.href='#steps';a.textContent='Открыть инструкцию';
  a.addEventListener('click',function(){setRoute(b.path)});
  box.appendChild(a);out.appendChild(box);

  var cnt=document.createElement('div');cnt.className='count';
  cnt.innerHTML='<span id="cnt"></span><span id="pct"></span>';out.appendChild(cnt);
  var bar=document.createElement('div');bar.className='bar2';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Собрано документов');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(b.keys.length));
  bar.innerHTML='<i></i>';out.appendChild(bar);
  var ul=document.createElement('ul');ul.className='list';
  b.keys.forEach(function(k){
    var li=document.createElement('li'),l=document.createElement('label'),i=document.createElement('input'),s=document.createElement('span'),g=document.createElement('small');
    i.type='checkbox';i.checked=!!ticked[k];i.addEventListener('change',function(){ticked[k]=i.checked;upd(b.keys)});
    s.textContent=DOCS[k].t;g.className='tag';g.textContent=DOCS[k].g;s.appendChild(g);
    l.appendChild(i);l.appendChild(s);li.appendChild(l);ul.appendChild(li);
  });
  out.appendChild(ul);
  var acts=document.createElement('div');acts.className='acts';
  var cp=document.createElement('button');cp.type='button';cp.className='btn alt';cp.textContent='Скопировать список';
  cp.addEventListener('click',function(){
    var txt=b.keys.map(function(k){return (ticked[k]?'[x] ':'[ ] ')+DOCS[k].t}).join('\n');
    var done=function(){cp.textContent='Список скопирован'};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,function(){cp.textContent='Не удалось скопировать'});
    else cp.textContent='Копирование недоступно в этом браузере';
  });
  var rs=document.createElement('button');rs.type='button';rs.className='btn alt';rs.textContent='Сбросить отметки';
  rs.addEventListener('click',function(){ticked={};render()});
  acts.appendChild(cp);acts.appendChild(rs);out.appendChild(acts);
  var n=document.createElement('p');n.className='note';
  n.textContent='Перечень примерный. Закрытого списка документов в проверенных нормах нет, поэтому пометка «'+UT+'» означает типовой документ, а не требование закона. Сроки и госпошлину уточняйте в органе опеки или суде.';
  out.appendChild(n);
  upd(b.keys);
}
function upd(keys){
  var d=keys.filter(function(k){return ticked[k]}).length,n=keys.length;
  $('#cnt').textContent='Собрано: '+d+' из '+n;
  $('#pct').textContent=Math.round(d/n*100)+'%';
  var bar=$('.bar2');bar.setAttribute('aria-valuenow',String(d));$('i',bar).style.width=(d/n*100)+'%';
}
$$('.q input').forEach(function(i){i.addEventListener('change',function(){ans[i.name]=i.value;render()})});
})();
