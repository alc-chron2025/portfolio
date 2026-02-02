

///★制御機能★動作★領域展開1★.DOM操作の基本3ステップ（要素生成　▶　属性追加　▶　HTML要素追加）のfunction宣言関数　//★通称：「領域展開」関数★/////////////////
function ryouikiTenkai(tag, attributes = {}, parentId = null) {
  // 1. 要素の生成
  const element = document.createElement(tag);

  // 2. 属性の設定（id, class など）
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // 3. 追加先の要素を決定（親要素が指定されていればそこへ、なければ body）
  const parent = parentId ? document.getElementById(parentId) : document.body;

  // 4. 親要素に追加
  parent.appendChild(element);

  return element;
}

// この関数を呼び出すときのコード記述例　）
//
//  ※以下のように引数を設定してこの関数に受け渡します。なお、関数にはデフォルト値を設定してあるので不要な引数は省略してもOKです。
//
//      ryouikiTenkai(  
//                      "div",                                //要素を指定
//                      { id: "message",                        //id名を指定
//                      class: "info-text" },                     //class名を指定
//                      "container"                                 //親要素を指定・・・指定なければbody要素の子要素として追加
//      );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///★制御機能★動作★領域展開2★.idをターゲットにしてHTML要素を挿入するDOM操作のfunction宣言関数////////////////////////////////////////////////////////////////
function ryouikiTenkai2(id, content) {
  const target = document.getElementById(id);
  if (target) {
    target.innerHTML = content;
  } else {
    console.warn(`要素（id="${id}"）が見つかりませんでした`);
  }
}

// この関数を呼び出すときのコード記述例　）
//
//  ※以下のように引数を設定してこの関数に受け渡します。
//
//      ryouikiTenkai2(  
//                      "message",                          //id名
//                      "<P>ここにHTMLの中身を挿入</p>"         //HTMLの内容を書き込む            
//      );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///★制御機能★生成★.質問・回答パーツの生成・展開フェーズのfunction宣言関数/////////////////////////////////////////////////////////////////////////////
function createSurveyUI() {
  ryouikiTenkai("div", { id: "question_erea" }, "question_zone");
  ryouikiTenkai("div", { id: "question_erea1" }, "question_erea");
  ryouikiTenkai("div", { id: "question_erea2" }, "question_erea");
  //ryouikiTenkai("div", { id: "question_erea3" }, "question_erea");
  ryouikiTenkai("div", { id: "mikaitou_alert" }, "myZone");

  showQuestion();




const options = [
  { text: '1.&nbsp;&nbsp;大いに当てはまる', value: 4 },
  { text: '2.&nbsp;&nbsp;やや当てはまる', value: 3 },
  { text: '3.&nbsp;&nbsp;どちらでもない', value: 2 },
  { text: '4.&nbsp;&nbsp;あまり当てはまらない', value: 1 },
  { text: '5.&nbsp;&nbsp;まったく当てはまらない', value: 0 }
];

options.forEach(({ text, value }, i) => {
  const id = `option${i + 1}`;
  ryouikiTenkai("div", { id }, "question_erea");
  ryouikiTenkai2(id, `<label><input type="radio" name="select" value="${value}">${text}</label>`);
});



  ryouikiTenkai("div", { id: "button_wrap" });
  const back = ryouikiTenkai("button", { id: "back" }, "button_wrap");
  back.textContent = "前に戻る";
  back.style.display = "none";

  const next = ryouikiTenkai("button", { id: "next" }, "button_wrap");
  next.textContent = "次へ進む";
  next.style.display = "inline-block";
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-2.表示切替制御に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///★★制御機能★画面表示★次の質問が存在する場合に、それを画面に表示し、前の選択肢の状態も復元する表示処理フェーズのfunction宣言関数/////////////////
function showNextQuestion() {
  ///次の3動作をセットで処理する
  firstQuestion(); //画面表示補助1
  showQuestion(); //画面表示補助2
  restoreAnswer(); //画面表示補助3
}

///★画面表示補助1★.「前に戻る」ボタンの表示・非表示を判定するfunction宣言関数//////////////
function firstQuestion(){
    if ( currentIndex < 1 ){                    //currentIndexの値が1未満かどうか判定
        back.style.cssText = "display: none;"; //1未満のとき非表示（すなわち1問目のとき）
    } else {
        back.style.display = "inline-block"; //1以上のとき表示（すなわち1問目以外のとき）
        //back.style.marginLeft = "20%";  //「ひとつ前に戻る」ボタンの表示位置を設定（CSS）
    }
}

///★画面表示補助2★.currentIndexをターゲットとした質問を表示するfunction宣言関数///////////
function showQuestion() {

    ///ryoikiTenkai2関数を呼び出して、id名によってdiv要素をターゲット指定してHTMLの中身を挿入
    if (!isMikaitouMode) {
      ryouikiTenkai2("question_erea1", '<p><strong style="font-size: 28px;">Q' + (currentIndex + 1) + '</strong> / ' 
      + Question.length + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>【ID:&nbsp;&nbsp;' + Question[currentIndex].id_no + '】</small></p>' );
    } else {
      ryouikiTenkai2("question_erea1", '<p><strong style="font-size: 28px;">Q' + (currentIndex + 1) + '</strong>' 
      + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>【ID:&nbsp;&nbsp;' + Question[currentIndex].id_no + '】</small></p>' );
    }
    ryouikiTenkai2("question_erea2", 
                    '<p>' + Question[currentIndex].shitumonbun + '</p>'  
    );


}


///★画面表示補助3★.保存されている回答状況をラジオボタンに反映させて表示するfunction宣言関数//////
function restoreAnswer(){
    const allOptions = document.querySelectorAll('input[name="select"]');
    allOptions.forEach(function(option){
        option.checked = false;  // まず全てのチェックを外す
    });

    const answer = Question[currentIndex].answer;

    if (typeof answer === "number") {
        const target = document.querySelector('input[name="select"][value="' + answer + '"]');
        if (target) {
            target.checked = true;  // 該当選択肢にチェックをつける
        }
    }
    // "未回答" や undefined の場合 → 何もしない（＝未選択のまま）
}



///★制御機能★表示切替★.スタート画面の切替（いったん非表示）フェーズのfunction宣言関数//////////////////////////////////////////////////////////////////////
function hideStartUI() {
  jQuery("#maeoki, #start, #start2").hide();
}


///★制御機能★表示切替★.アンケートが最後まで到達した際に、終了演出と結果表示のUI切り替えを行う「締めくくり」フェーズのfunction宣言関数////////////////////////
async function showCompletionScreen() {
  //const sound1 = new Audio("sound/button_sound8_simple4.mp3");
  //sound1.play();
  await wait(400);

  alert("ここまでの回答状況の一覧表を表示します。");

  const sound2 = new Audio("sound/button_sound4_simple2.mp3");
  sound2.play();

  //★モード切替・・・いったんすべてのモードから外れる
    jQuery("#mode1").css("display", "none");
    jQuery("#mode2").css("display", "none");
    jQuery("#mode3").css("display", "none");

  jQuery("#question_erea, #next, #back, #midashi").hide();
  await wait(800);

  jQuery("#zenminaoshi_go, #mikaitou_go, #graph_go, #kaitou_joukyou").show();
  const table = document.getElementById("table_wrap");
  if (table) {table.classList.add("visible");}
  jQuery("#table_wrap").css("display", "flex");

  const mikaitou = Question.length - getAnsweredCount();
  updateMikaitouStatus(mikaitou);

  //未回答のインデックス一覧を取得してグローバルへ格納
  window.mikaitouIndex = getMikaitouIndexes(); //どの関数の外からも参照できるグローバル変数のためwindow.で記述
}


///★制御機能★表示切替★
function hideAllUIAndShowMidashi() {
  const hideIds = [
    "#maeoki", "#question_erea", "#kaitou_joukyou", "#myTable",
    "#question_erea1", "#question_erea2", "#question_erea3",
    "#option1", "#option2", "#option3", "#option4",
    "#button_wrap", "#myZone", "#back", "#graph_go",
    "#test1", "#test2", "#test3", "#test4", "#test5", "#test6", "#test7",
    "#midashi"
  ];

  hideIds.forEach(id => jQuery(id).css("display", "none"));

  jQuery("#midashi2").css("display", "block");
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-3.ラジオボタンの動作に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///★制御機能★ラジオボタン動作★.ラジオボタンの選択もれを確認するfunction宣言関数///////////////////////////////////////////////////////////////////////////////////
function isAnswerSelected() {
    const selectedOption = document.querySelector('input[name="select"]:checked');

    if (!selectedOption) {
        if (confirm("回答が未選択です！この質問の回答を保留したまま先へ進みますか？")) {
            
            //すでに配列に登録済みじゃないかチェックしてから追加！
            if (!Mikaitou_answer.includes(currentIndex)) {
                Mikaitou_answer.push(currentIndex); // ここは currentIndex の方が安全です！
            }

        } else {
            alert("回答選択肢を1つ選んでください。");
            return false; // 中断した場合、false を返すのが親切
        }
    } else {
        // ラジオボタンが選択されていたとき：未回答リストから除外
        if (Mikaitou_answer[0] === currentIndex) {
            Mikaitou_answer.shift(); // 一致していれば削除
        } else {
            Mikaitou_answer = Mikaitou_answer.filter(index => index !== currentIndex);
        }
    }

    return true;
}


///★制御機能★ラジオボタン動作★.「回答が選ばれているか」を確認し、選ばれていたら保存する、いわゆる「関所」フェーズのfunction宣言関数////////////////////////////////
function checkAndSaveAnswer() {
  if (!isAnswerSelected()) return false;
  saveAnswer();
  return true;
}


///★制御機能★ラジオボタン動作★.ラジオボタンで選択された値を取得保存するfunction宣言関数////////////////////////////////////////////////////////////////////////////
function saveAnswer(){

    const selectedOption = document.querySelector('input[name="select"]:checked'); //ラジオボタンで選択された値を取得

    if (selectedOption) {
        const selectedValue = Number(selectedOption.value); //文字列を数値に変換
        Question[currentIndex].answer = selectedValue; //Question配列のanswerプロパティの値として保存
        playSound("sound/button_sound8_simple4.mp3"); //効果音
        updateSummaryCell(currentIndex, selectedValue); //★updateSummaryCell関数の呼出（引数はcurrentIndexとselectedValue）
    
    } else {

        Question[currentIndex].answer = "未回答"; //未選択のときは「未回答」で保存
        playSound("sound/button_sound_error.mp3"); // ←未選択エラー効果音をここで鳴らす
        updateSummaryCell(currentIndex, "未回答"); //★updateSummaryCell関数の呼出（引数はcurrentIndexと"未回答"）

    }
}


///★制御機能★ラジオボタン動作★.ラジオボタンのチェックを外すfunction宣言関数///////////////////////////////////////////////////////////////////////////////////////
function clearSelection() {
    const options = document.querySelectorAll('input[name="select"]');
    options.forEach(option => option.checked = false);
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-4.回答状況一覧に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///★制御機能★動作★回答状況一覧の書き換え★.回答状況一覧表のセルを書き換えていくfunction宣言関数//////////////////////////////////////////////
function updateSummaryCell(index, value) {
    let cellId = "data" + (index + 1);// "data●"をcellIDとして認識
    let cell = document.getElementById(cellId); //"data●"を変数cellに代入
    if (!cell) return; //該当する"data●"がなければ処理なし

    let pattern; //セルを書き換える内容を代入するための変数を定義
    let row = cell.closest("tr") // td の親 → tr もいっしょに色を変えるための措置
            
    switch (value) {
        case 0:
            pattern = "● ② ③ ④ ⑤";
            row.classList.add("answered"); //該当する"data●"の tr に「answered」という名前のクラスを追加
            break;
        case 1:
            pattern = "① ● ③ ④ ⑤";
            row.classList.add("answered"); //該当する"data●"の tr に「answered」という名前のクラスを追加
            break;
        case 2:
            pattern = "① ② ● ④ ⑤";
            row.classList.add("answered"); //該当する"data●"の tr に「answered」という名前のクラスを追加
            break;
        case 3:
            pattern = "① ② ③ ● ⑤";
            row.classList.add("answered"); //該当する"data●"の tr に「answered」という名前のクラスを追加
            break;
	case 4:
            pattern = "① ② ③ ④ ●";
            row.classList.add("answered"); //該当する"data●"の tr に「answered」という名前のクラスを追加
            break;
        case "未回答":
        default:
            pattern = "① ② ③ ④ ⑤";
            
    }

    cell.textContent = pattern; //該当するセルの内容を書き換える
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-5.未回答管理に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//★制御機能★未回答管理★未回答数を数えるfunction宣言関数///////////////////////////////////////////////////////////////////////////////////////////////////
function getAnsweredCount() {
    //Question配列の中の「answerプロパティが存在し、かつ未回答でない質問の数」をフィルターをかけてカウント
    return Question.filter(q => "answer" in q && q.answer !== "未回答").length;
}


//★制御機能★未回答管理★.未回答の質問を見つけ出して、あとでナビゲーションや確認に使えるように準備するfunction宣言関数////////////////////////////////////////
function getMikaitouIndexes() {
  const mikaitouIndex = [];

  for (let i = 0; i < Question.length; i++) {
    if (Question[i].answer === "未回答") {
      mikaitouIndex.push(i);
    }
  }

  return mikaitouIndex;
}


///★機能制御★未回答管理★.未回答数に応じて、UIの警告・ボタン表示状態を制御する「回答状況の通知」をするフェーズのfunction宣言関数////////////////////////////////
function updateMikaitouStatus(mikaitou) {
  if (mikaitou === 0) {
    ryouikiTenkai2("mikaitou_alert", '<p>すべての質問に回答済です。</p>');
    jQuery("#zenminaoshi_go").css("display", "inline-block");
    jQuery("#mikaitou_go").hide();
    jQuery("#graph_go").show();
  } else {
    ryouikiTenkai2("mikaitou_alert",
      '<p><span style="color:rgb(100,100,200); background-color: rgba(0,150,250,0.1); border-radius: 10px;">&nbsp;&nbsp;&nbsp;全'
      + Question.length + '問のうち、<strong style="color:rgb(0,0,255); font-size:20px;">' + mikaitou
      + '問</strong>が<strong style="color:rgb(0,0,255); font-size:20px;">未回答</strong>です。&nbsp;</span></p>'
    );
    jQuery("#zenminaoshi_go").css("display", "inline-block");
    jQuery("#mikaitou_go").show();
    jQuery("#graph_go").hide();
  }
}


//★制御機能★未回答管理★.未回答モード用UIを初期化するfunction宣言関数////////////////////////////////////////////////////////////////////////////////////////
function resetSurveyUIForReview_mikaitou() {
  jQuery("#question_erea, #next, #back, #midashi").show(); // 本体部分を再表示
  jQuery("#zenminaoshi_go, #mikaitou_go, #graph_go, #kaitou_joukyou").hide(); // 結果ボタン類を隠す

  const table = document.getElementById("table_wrap");
  if (table) table.classList.remove("visible");

  jQuery("#table_wrap").css("display", "none"); // 回答結果表を非表示に戻す
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-6.各種ボタンの機能に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//★ボタン機能★スタート★.「スタート」ボタンクリック時のfunction宣言関数//////////////////////////////////////////////////////////////////////
//【この関数の役割：アンケートの開始時に、必要な演出とUIパーツ（質問表示・回答欄・操作ボタンなど）を動的に準備・表示】
async function startSurveyFlow() {
    const start_button = document.getElementById("start") || document.getElementById("start2");
    if (!start_button) return;

    ///以下の関数を呼び出す
    await playStartAnimation(start_button); //スタート演出
    hideStartUI(); //スタート画面の切替（いったん非表示）
    createSurveyUI(); //質問・回答パーツの生成・展開

    //★モード切替
    jQuery("#mode1").css("display", "block");
    jQuery("#mode2").css("display", "none");
    jQuery("#mode3").css("display", "none");
}


//★ボタン機能★次に進む★.「次へ進む」ボタンクリック時のfunction宣言関数//////////////////////////////////////////////////////////////////////////////////////////
async function handleNextButtonClick() {
  if (!checkAndSaveAnswer()) return;

  // ✅ indexの有効性チェック → エラー防止に有効！
  if (currentIndex >= Question.length) {
    await showCompletionScreen();
    return;
  }

  if (isMikaitouMode) {
    //未回答巡回モードの進行処理
    mikaitouStep++;

    //★テスト中（動作確認中）
    let target = document.querySelector("#mikaitou_nokori");
    if (target) {
      if (Question.length - getAnsweredCount() === 0) {
        target.textContent = 'すべて回答できました。';
        await wait(1000);        
      } else {
        target.textContent = '未回答の質問が残り' + (Question.length - getAnsweredCount()) + '問あります。';
      }
    }

    if (mikaitouStep < mikaitouIndex.length) {
      currentIndex = mikaitouIndex[mikaitouStep];
      firstQuestion();
      showQuestion();
      restoreAnswer();
    } else {
      isMikaitouMode = false; // モードを通常に戻す
      await showCompletionScreen();
    }

  } else {
    //通常の1問ずつ進行モード
    currentIndex++;
    jQuery("#next").css("display", "inline-block");
    firstQuestion();

    //プログレスバーにデータを代入
    let answered = getAnsweredCount();
    let total = Question.length;
    updateProgress(answered, total); //★関数呼び出し


    if (currentIndex < Question.length) {
      firstQuestion();
      showNextQuestion();
    } else {
      await showCompletionScreen();
    }
  }
}


//★ボタン機能★前に戻る★.「前に戻る」ボタンクリック時のfunction宣言関数//////////////////////////////////////////////////////////////////////////////////////
function handleBackButtonClick() {
  // 🔁 未回答モードのときだけ mikaitouStep を使う
  if (isMikaitouMode) {
    if (mikaitouStep > 0) {
      mikaitouStep--;
      currentIndex = mikaitouIndex[mikaitouStep];

      playSound("sound/button_sound12_pop2.mp3");
      next.style.cssText = "display: inline-block;";
      firstQuestion();
      showQuestion();
      restoreAnswer();
      saveAnswer();
    } else {
      alert("これ以上戻れません");
    }
  } else {
    if (currentIndex > 0) {
      currentIndex--;

      playSound("sound/button_sound12_pop2.mp3");
      next.style.cssText = "display: inline-block;";
      firstQuestion();
      showQuestion();
      restoreAnswer();
      saveAnswer();
    } else {
      alert("これ以上戻れません");
    }
  }
}


//★ボタン機能★すべての質問を見直す★.「すべての質問を見直す」ボタンをクリックしたときに呼び出される、アンケートUIの再表示・初期化用のfunction宣言関数//////////////////////////
async function resetSurveyUIForReview() {
  // 一度すべて非表示に（完了画面を隠す）
  jQuery("#kaitou_joukyou, #graph_go, #mikaitou_go, #zenminaoshi_go, #table_wrap").hide();
  jQuery("#mikaitou_alert").empty();

  // 質問UIは「非表示」ではなく「必要なら再生成 or 再表示」
  if (!document.getElementById("question_erea")) {
    createSurveyUI(); // ← これでUIを再生成
  } else {
    jQuery("#question_erea, #button_wrap, #back, #next").show(); // ← UIが残っているなら再表示
  }

  currentIndex = 0; //インデックス初期化
  firstQuestion();
  showQuestion(); //最初の質問を表示
  restoreAnswer(); //選択状態を復元
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-7.演出に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///★制御機能★演出★.スタート演出フェーズのfunction宣言関数////////////////////////////////////////////////////////////////////////////////////////////
async function playStartAnimation(button) {
  button.id = "start2";
  for (let i = 0; i < 7; i++) {
    button.textContent = "NOW LOADING....";
    await wait(150);
    button.textContent = "";
    await wait(100);
  }
  button.textContent = "Let's start ♪";
  await wait(800);
  button.textContent = "";
  await wait(100);
}


///★制御機能★演出★.グラフ結果表示のときの解析中アニメーションのfunction宣言関数///////////////////////////////////////////////////////////
async function analyzeAnimation(targetId = "start2") {
  const messages = [
    "解析中.........🐈",
//    "解析中........🐈.",
    "解析中.......🐈..",
//    "解析中......🐈...",
    "解析中.....🐈....",
//    "解析中....🐈.....",
    "解析中...🐈......",
//    "解析中..🐈.......",
    "解析中.🐈........",
//    "解析中🐈........",
  ];

  const target = document.getElementById(targetId);
  if (!target) return;

  jQuery(`#${targetId}`).css("display", "block");

  for (let i = 0; i < messages.length; i++) {
    target.textContent = messages[i];
    await wait(400); // 表示時間はお好みで調整可能
    target.textContent = "";
    await wait(100);
  }

  jQuery(`#${targetId}`).css("display", "none");

  // 効果音再生
  const sound = new Audio("sound/button_sound13_kettei3.mp3");
  sound.play();
}


///★制御機能★演出★プログレスバー//////////////////////////////////////////////////////////////////////////////////////////////////////
function updateProgress(answered, total) {
  const progress = document.getElementById("progress");
  //const label = document.getElementById("progress_percent");
  const rate = total > 0 ? Math.floor((answered / total) * 100) : 0;
  
  progress.value = rate;
  //label.textContent = rate + '%';
}


//★制御機能★演出★.効果音を出すためのfunction宣言関数///////////////////////////////////////////////////////////////////////////////////////////////
function playSound(soundPath) {
  const sound = new Audio(soundPath);
  sound.play();
}


//★制御機能★演出★.効果音を使うときに待ち時間を調整するfunction宣言関数//////////////////////////////////////////////////////////////////////////////////
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-8.集計作業に関する関数
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let value_H, value_A, value_R, value_M, value_O, value_N, value_Y;
let value_tate, value_yoko, value_GRB;
//let circleData = [];


// ★点数の集計作業をするためのfunction宣言関数////////////////////////////////////////////////////////////////////////////////////////////
function aggregation() {
    //各カテゴリーの合計点を算出【絶対点数】
    value_H = (Question.filter(q => q.harmony_H === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_H === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));

    value_A = (Question.filter(q => q.harmony_A === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_A === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));

    value_R = (Question.filter(q => q.harmony_R === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_R === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));

    value_M = (Question.filter(q => q.harmony_M === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_M === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));
    
    value_O = (Question.filter(q => q.harmony_O === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_O === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));
    
    value_N = (Question.filter(q => q.harmony_N === "◎" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))*2
                  + (Question.filter(q => q.harmony_N === "〇" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));



    value_tate = (Question.filter(q => q.tate_yoko === "タテ" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))
                  + (Question.filter(q => q.tate_yoko === "タテヨコ" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));
    
    value_yoko = (Question.filter(q => q.tate_yoko === "ヨコ" && q.answer != null).reduce((sum, q) => sum + q.answer, 0))
                  + (Question.filter(q => q.tate_yoko === "タテヨコ" && q.answer != null).reduce((sum, q) => sum + q.answer, 0));


    //各カテゴリーの【絶対点数】を【100点満点の相対点数】に変換する
    value_H = Math.round(value_H / 20*100);
    value_A = Math.round(value_A / 68*100);
    value_R = Math.round(value_R / 60*100);
    value_M = Math.round(value_M / 40*100);
    value_O = Math.round(value_O / 28*100);
    value_N = Math.round(value_N / 24*100);

    value_tate = (value_tate / 32*10);  //タテ6問+タテヨコ2問
    value_yoko = (value_yoko / 28*10);  //ヨコ5問+タテヨコ2問

    //変数定義を「数値」に設定しておく
    value_H = Number(value_H.toFixed(1));
    value_A = Number(value_A.toFixed(1));
    value_R = Number(value_R.toFixed(1));
    value_M = Number(value_M.toFixed(1));
    value_O = Number(value_O.toFixed(1));
    value_N = Number(value_N.toFixed(1));

    value_tate = Number(value_tate.toFixed(1));
    value_yoko = Number(value_yoko.toFixed(1));



    //Yスコア
    value_Y = ( value_H + value_A + value_R + value_M + value_O + value_N ) / 6;
    value_Y = Number(value_Y.toFixed(0));

    //GRBスコア
    value_GRB = (value_tate * value_yoko) - 1.5*(( 10 - value_tate) * ( 10 - value_yoko));
    value_GRB = Math.round(((value_GRB / 150) * 12 * 2) / 2);
    value_GRB = Number(value_GRB.toFixed(1));
    if ( value_GRB > 0) {
      value_GRB = "+" + value_GRB;
    } else {
      value_GRB = value_GRB;
    }
    

    return { value_H, value_A, value_R, value_M, value_O, value_N, value_Y, value_tate, value_yoko, value_GRB };

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★-9.グラフ作成に関する関数（Chart.jsによるグラフ表示の設定）
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        

//★【グラフ1：レーダーチャート】の作成★のfunction宣言関数///////////////////////////////////////////////////////////////////////////
function graphMaker2(result){
  const ctx2 = document.getElementById('myRadarChart').getContext('2d');
      new Chart(ctx2, {
              type: 'radar',
              data: {
                  labels: [ category_a,
                              category_b,
                              category_c,
                              category_d,
                              category_e,
                              category_f
                          ],

                  datasets: [{
                          //label: ,
                          data: [
                                  result.category_a_point,
                                  result.category_b_point,
                                  result.category_c_point,
                                  result.category_d_point,
                                  result.category_e_point,
                                  result.category_f_point
                                ],

                          backgroundColor: 'rgba(0, 150, 250, 0.05)',
                          borderColor: 'rgba(0,150,250, 0.9)',
                          borderWidth: 1.6                                            
                  }]
              },
              options: {
                      layout: {
                              padding: {
                                      top: 85, // 上の余白・・・大きめの数値の方がグラフに近づく・・・
                                      bottom: 0  // 下の余白                                                       
                              } 
                      },
                      plugins: {
                              title: {
                                      display: true, // タイトルを表示する
                                      // position: 'chartArea', // グラフエリア内にタイトルを配置
                                      text: '【 基本6カテゴリー評価項目のスコア 】', // タイトルのテキスト
                                      font: {
                                              size: 20, // タイトルのフォントサイズを20pxに設定
                                              //style: 'normal' // 通常の横書きスタイル
                                      },
                                      padding: {
                                              top: 0, // 上の余白を調整
                                              bottom: 0 // 下の余白を調整
                                      }
                              },
                              legend: {
                                      display: false // 凡例を非表示にする
                              },
                              datalabels: {
                                      anchor: 'end',   // 'start' | 'center' | 'end'
                                      align: 'end',    // 'top' | 'bottom' | 'left' | 'right' | 'center'
                                      offset: 7,
                                      //formatter: (value) => value + '点', //単位
                                      clip: false,   // グラフ外表示の許可
                                      color: 'rgba(0,150,250, 1)',
                                      font: {size: 14},
                                      //font: {size: 26, weight: 'bold'}
                              }
                      },
                      scales: {
                              r: {
                                      beginAtZero: true,
                                      max: 10,
                                      pointLabels: {
                                              font: { size:18,} //軸ラベルのフォントサイズを設定
                                      },
                                      ticks: {
                                          stepSize: 2,
                                          font : { size: 12}, // 軸ラベルのフォントサイズを設定
                                          color:'#ddd' //軸ラベルのフォントカラーを設定
                                      }
                              }
                      }
                      
              },
              plugins: [ChartDataLabels]
    });
  }


//★【グラフ2：横棒グラフ】の作成★のfunction宣言関数///////////////////////////////////////////////////////////////////////////
function graphMaker(result){ 
  const ctx1 = document.getElementById('myChart').getContext('2d');
      new Chart(ctx1, {
              type: 'bar',
              data: {
                      labels: [
                                category_shinrianzen,
                                category_chuusei,
                                total,
                                douki,
                                eisei               
                              ],
                      datasets: [{
                              //label: '検査Ⅰ',
                              data: [ 
                                      result.category_shinrianzen_point,
                                      result.category_chuusei_point,
                                      result.total_point,
                                      result.douki_point,
                                      result.eisei_point                                                                                     
                                    ],
                              backgroundColor: 'rgba(30,150,250, 0.6)',
                              borderColor: 'rgba(0,150,250, 1)',
                              borderWidth: 0.4
                      }]
              },
              options: {
                      indexAxis: 'y', // 横棒グラフにする
                      plugins: {
                              title: {
                                      display: true, // タイトルを表示する
                                      text: '【 横断的評価項目のスコア 】', // タイトルのテキスト
                                      font: {
                                              size: 20 // タイトルのフォントサイズを20pxに設定
                                      }
                              },
                              legend: {
                                      display: false // 凡例を非表示にする
                              },
                              datalabels: {
                                      anchor: 'end',   // 'start' | 'center' | 'end'
                                      align: 'right',    // 'top' | 'bottom' | 'left' | 'right' | 'center'
                                      offset: 0,
                                      formatter: (value) => value + '点', //単位
                                      clip: false,   // グラフ外表示の許可
                                      color: "#000"
                              }
                      },
                      responsive: true,  // 画面サイズに適応
                      maintainAspectRatio: false,  // アスペクト比を無視してサイズ調整
                      scales: {                                               
                              x: { 
                                      beginAtZero: true,
                                      max: 100 //軸の最大値                                       
                              },
                              y: { grid: { display: true } }
                      },
                      ticks: {
                              max: 100, // 横軸（x軸）の最大値を15に設定
                              stepSize: 10,
                              font : { size: 15} // 軸ラベルのフォントサイズを15pxに設定
                      }
              },
              plugins: [ChartDataLabels]
      });
    }





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1.処理の流れ
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-1.変数定義
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////               
    let currentIndex = 0; //初期値は0
    //let mikaitouIndex = 0; //初期値は0
    let mikaitouStep = 0;
    let isMikaitouMode = false;  //最初は通常モードなので、未回答巡回モードの初期値はfalse
    
    let Mikaitou_answer = []; //未回答の質問の★を格納保存するための配列を準備

    //評価項目(18項目）を定義
    const category_a = "A.やりがい";
    const category_b = "B.成長実感";
    const category_c = "C.自律性・裁量";
    const category_d = "D.人間関係・ｺﾐｭﾆｹｰｼｮﾝ";
    const category_e = "E.報酬・待遇";
    const category_f = "F.働きやすさ";

    
    //大きいカテゴリーの定義
    //評価項目をさらに4つに分類するためのカテゴリーを定義
    const category_shinrianzen = "心理的安全性スコア";
    const category_chuusei = "ロイヤリティスコア";
    const total = "エンゲージメントスコア";
    const eisei = "衛生要因スコア";
    const douki = "動機付け要因スコア";

    


    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-2.「スタート」ボタンをクリックしたときの処理内容
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#start", startSurveyFlow); 



       

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-3.「次へ進む」ボタンをクリックしたときの処理内容
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#next", handleNextButtonClick);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-4.「前に戻る」ボタンをクリックしたときの処理内容
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#back", handleBackButtonClick);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-5.「全ての回答を見直す」ボタンをクリックしたときの処理内容
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#zenminaoshi_go", async function () {
    
    await resetSurveyUIForReview();

    //★モード切替
    jQuery("#mode1").css("display", "none");
    jQuery("#mode2").css("display", "none");
    jQuery("#mode3").css("display", "block");

});

//テスト中
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#kaitou_joukyou_go", async function () {
  showCompletionScreen();    

  /* 
  //★モード切替・・・すべてのモードから外れる
  jQuery("#mode1").css("display", "none");
  jQuery("#mode2").css("display", "none");
  jQuery("#mode3").css("display", "none");
*/

});
//テスト中



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1-6.「未回答の質問へ進む」ボタンをクリックしたときの処理内容
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#mikaitou_go", function () {
  window.mikaitouIndex = getMikaitouIndexes();
  mikaitouStep = 0;
  isMikaitouMode = true;

  if (mikaitouIndex.length === 0) {
    showCompletionScreen();
    return;
  }

  resetSurveyUIForReview_mikaitou();
  currentIndex = mikaitouIndex[mikaitouStep];
  firstQuestion();
  showQuestion();
  restoreAnswer();


  //★動作確認中
  let target = document.querySelector("#mikaitou_nokori");
  if (target) {
    target.textContent = '未回答の質問が残り' + (Question.length - getAnsweredCount()) + '問あります。';
  } 

  //★モード切替
  jQuery("#mode1").css("display", "none");
  jQuery("#mode2").css("display", "block");
  jQuery("#mode3").css("display", "none");

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 結果画面に3つのボタンを生成するモジュール
 *
 * @param {HTMLElement} container  --- ボタンを挿入したい要素
 * @param {string} noteUrl         --- note記事のURL
 * @param {string} shareText       --- X でシェアする際の文章
 */
function createResultButtons(container, noteUrl, shareText) {
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "button-container";

  // もう一度診断する
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "もう一度診断する";
  restartBtn.onclick = () => location.reload();
  buttonsDiv.appendChild(restartBtn);

  // Xでシェアする
  const xBtn = document.createElement("button");
  xBtn.textContent = "Xでシェアする";
  xBtn.onclick = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };
  buttonsDiv.appendChild(xBtn);

  // noteで詳細を見る
  const noteBtn = document.createElement("button");
  noteBtn.innerHTML = "このアプリの制作者<br>（noteプロフィール）";
  noteBtn.onclick = () => window.open("https://note.com/alc_chron2025", "_blank");
  buttonsDiv.appendChild(noteBtn);

  container.appendChild(buttonsDiv);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//★.「結果を表示する」ボタンをクリックしたときの処理内容
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).on("click", "#graph_go", async function() {
  
  //効果音♪
  let sound_kekka = new Audio("sound/button_sound13_kettei3.mp3");
  sound_kekka.play();

  //画面表示切替
  hideAllUIAndShowMidashi();

  //スコア集計作業および関数からのスコアの受け取り
  analyzeAnimation(); //集計作業
  const scores = aggregation(); //受け取り

      // 意味データ（レイアウト順）
    let circleData = [
      { label1: 'H', label2: '支援する', label3: '組織文化', value: scores.value_H },
      { label1: 'R', label2: '信頼する', label3: '組織文化', value: scores.value_R },
      { label1: 'A', label2: '受容する', label3: '組織文化', value: scores.value_A },
      { label1: 'N', label2: '育成支援', label3: 'による安心感', value: scores.value_N },
      { label1: 'O', label2: '自律/裁量', label3: 'による安心感', value: scores.value_O },
      { label1: 'M', label2: '相互理解', label3: 'による安心感', value: scores.value_M },
      { label1: 'Y', label2: 'Your', label3: 'Presence', value: scores.value_Y }
    ];

    let squareData = [
      { value: scores.value_tate },
      { value: scores.value_yoko },
      { value: scores.value_GRB }
    ];  

  
  //HARMONYフレームワークの作成
  init();
  jQuery("#harmony").css("display", "block");

  //表に点数を反映
  document.getElementById("score_H").innerHTML = value_H + "/<small>100点</small>";
  document.getElementById("score_A").innerHTML = value_A + "/<small>100点</small>";
  document.getElementById("score_R").innerHTML = value_R + "/<small>100点</small>";
  document.getElementById("score_M").innerHTML = value_M + "/<small>100点</small>";
  document.getElementById("score_O").innerHTML = value_O + "/<small>100点</small>";
  document.getElementById("score_N").innerHTML = value_N + "/<small>100点</small>";
  document.getElementById("score_Y").innerHTML = value_Y + "/<small>100点</small>";


  document.getElementById("score_tate").innerHTML = value_tate + "/<small>10点</small>";
  document.getElementById("score_yoko").innerHTML = value_yoko + "/<small>10点</small>";
  document.getElementById("score_GRB").innerHTML = value_GRB;




  //結果のグラフ表示エリアの整備
  ryouikiTenkai("div",{ id: "Charterea", });  //ryoikiTenkai関数を呼び出して、id名「Charterea」というdiv要素を追加
  ryouikiTenkai("canvas",{ id: "myRadarChart",},"Charterea");  //ryoikiTenkai関数を呼び出して、id名「myRadarChart」というcanvas要素を追加
  ryouikiTenkai("canvas",{ id: "myChart", },"Charterea");  //ryoikiTenkai関数を呼び出して、id名「myChart」というcanvas要素を追加
  
       
  //グラフの作成
           
  graphMaker2(result); //レーダーチャートの作成
  graphMaker(result); //横棒グラフの作成


//3つのボタンを生成
const resultDiv = document.getElementById("result-buttons");

createResultButtons(
  resultDiv,
  "https://note.com/あなたの記事URL",
  "この診断ツールを試してみたよ！"
);



});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// キャンバス設定
const canvas = document.getElementById('harmony_Canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 480;

const centerX = canvas.width / 2;
const centerY = (canvas.height / 2) +20;
const baseRadius = 40;
const triangleSize = 200;

const circleCenters = [];
const midPoints = [];



// 色データ（インデックスで対応）
//const fillColors = ["#FFD1DC", "#C1E1FF", "#FFFAC1", "#C1C1E5", "#D1FFC1", "#FFDDC1", "#E1C1FF"];
const fillColors = ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"];
const strokeColors = ["#FF4466", "#1E90FF", "#FFD700", "#101077", "#32CD32", "#FF8C00", "#8A2BE2"];


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateCircleData(scores) {
  return [
    { label1: 'H', label2: '支援する', label3: '組織文化', value: scores.value_H },
    { label1: 'R', label2: '信頼する', label3: '組織文化', value: scores.value_R },
    { label1: 'A', label2: '受容する', label3: '組織文化', value: scores.value_A },
    { label1: 'N', label2: '育成支援', label3: 'による安心感', value: scores.value_N },
    { label1: 'O', label2: '自律/裁量', label3: 'による安心感', value: scores.value_O },
    { label1: 'M', label2: '相互理解', label3: 'による安心感', value: scores.value_M },
    { label1: 'Y', label2: 'Your', label3: 'Presence', value: scores.value_Y }
  ];
}

function generateSquareData(scores) {
  return [
    { value: scores.value_tate },
    { value: scores.value_yoko },
    { value: scores.value_GRB }
  ];
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupCircles() {
  const trianglePoints = [];
  const angleStep = (Math.PI * 2) / 3;

  // 円1〜円3（三角形の頂点）
  for (let i = 0; i < 3; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * triangleSize;
    const y = centerY + Math.sin(angle) * triangleSize;
    trianglePoints.push({ x, y });

    circleCenters.push({
      x, y,
      radius: baseRadius + 10,
      ...circleData[i],
      fillColor: fillColors[i],
      strokeColor: strokeColors[i]
    });
  }

  // 円4〜円6（三角形の辺の中点）
  for (let i = 0; i < 3; i++) {
    const p1 = trianglePoints[i];
    const p2 = trianglePoints[(i + 1) % 3];

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    midPoints.push({ x: midX, y: midY });

    const dx = centerX - midX;
    const dy = centerY - midY;
    const shiftFactor = -0.1;

    const shiftedX = midX + dx * shiftFactor;
    const shiftedY = midY + dy * shiftFactor;

    const j = i + 3;

    circleCenters.push({
      x: shiftedX,
      y: shiftedY,
      radius: baseRadius + 3,
      ...circleData[j],
      fillColor: fillColors[j],
      strokeColor: strokeColors[j]
    });
  }

  // 円7（中央）
  circleCenters.push({
    x: centerX,
    y: centerY,
    radius: baseRadius + 12,
    ...circleData[6],
    fillColor: fillColors[6],
    strokeColor: strokeColors[6]
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawFramework() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 三角形の描画
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * triangleSize;
    const y = centerY + Math.sin(angle) * triangleSize;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 中点から中心への線
  midPoints.forEach(pt => {
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 円とラベルの描画
  circleCenters.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fillStyle = pt.fillColor || '#ddf';
    ctx.strokeStyle = pt.strokeColor || '#009';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // ラベル1（大きめ）
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(pt.label1, pt.x, pt.y - 30);

    // ラベル2（中サイズ）
    ctx.font = '16px sans-serif';
    ctx.fillText(pt.label2, pt.x, pt.y - 8);

    // ラベル3（小サイズ）
    ctx.font = '12px sans-serif';
    ctx.fillText(pt.label3, pt.x, pt.y + 8);

    // 数値（中サイズ）
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${pt.value}点`, pt.x, pt.y + 28);
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawCompositeBars(scores) {

  generateSquareData(scores);

  let dataX = scores.value_yoko*300/10;
  let dataY = scores.value_tate*300/10;

  // キャンバス設定
  const canvas2 = document.getElementById('square_Canvas');
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = 300;
  canvas2.height = 300;


  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  // 背景の赤い正方形
  ctx2.fillStyle = 'rgba(255, 182, 193, 0.8)';
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  const barWidth = 300;
  const barHeight = 300;

  // 縦棒（青色）
  const blueHeight = dataY; // 例：80px
  const blueX = 0;
  const blueY = canvas2.height - blueHeight;

  ctx2.fillStyle = 'rgba(173, 213, 230, 0.8)';
  ctx2.fillRect(blueX, blueY, barWidth, blueHeight);

  // 横棒（黄色）
  const yellowWidth = dataX; // 例：60px
  const yellowX = 0;
  const yellowY = 0;

  ctx2.fillStyle = 'rgba(255, 255, 153, 0.8)';
  ctx2.fillRect(yellowX, yellowY, yellowWidth, barHeight);

  // 重なり領域の計算
  const overlapX = Math.max(blueX, yellowX);
  const overlapY = Math.max(blueY, yellowY);
  const overlapRight = Math.min(barWidth, yellowX + yellowWidth);
  const overlapBottom = Math.min(blueY + blueHeight, barHeight);

  const overlapWidth = overlapRight - overlapX;
  const overlapHeight = overlapBottom - overlapY;

  // 重なりが存在する場合のみ描画
  if (overlapWidth > 0 && overlapHeight > 0) {
    ctx2.fillStyle = 'rgba(152, 251, 152, 0.8)'; // 緑色
    ctx2.fillRect(overlapX, overlapY, overlapWidth, overlapHeight);

  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init() {
  const scores = aggregation(); // スコア計算
  circleData = generateCircleData(scores); // スコアで再構築
  setupCircles(); // 円の配置
  drawFramework(); // 描画


  //drawCompositeBars(dataX, dataY); // 棒グラフ重なり（四角形）//タテヨコ分析
  drawCompositeBars(scores); // 棒グラフ重なり（四角形）//タテヨコ分析
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ★★★　質問データベース　★★★
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
    //質問のデータベース（オブジェクトの配列）
        const Question = [

            {id_no: "MPB-005"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: ""
            ,harmony_M: "◎"
            ,harmony_O: ""
            ,harmony_N: "〇"
            ,tate_yoko: "ヨコ"
            ,shitumonbun: "同僚やチームと働くことで、仕事がより<br>楽しいと感じることができる"
            },

            {id_no: "MPB-010"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "〇"
            ,harmony_M: ""
            ,harmony_O: ""
            ,harmony_N: "◎"
            ,tate_yoko: ""
            ,shitumonbun: "失敗や批判を恐れずに安心して自分のスキルや<br>能力を磨く挑戦ができる環境だと感じる"
            },

            {id_no: "MPB-013"
            ,harmony_H: "◎"
            ,harmony_A: ""
            ,harmony_R: ""
            ,harmony_M: ""
            ,harmony_O: "◎"
            ,harmony_N: ""
            ,tate_yoko: "タテヨコ"
            ,shitumonbun: "業務の裁量が自分にありつつも、上司や同僚から<br>適切なサポートを受けられるバランスもある"
            },

            {id_no: "MPB-014"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "〇"
            ,harmony_M: ""
            ,harmony_O: "◎"
            ,harmony_N: ""
            ,tate_yoko: ""
            ,shitumonbun: "業務の進め方について自由に選択できる<br>環境があり、その選択が尊重されている"
            },

            {id_no: "MPB-015"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "◎"
            ,harmony_M: ""
            ,harmony_O: ""
            ,harmony_N: "〇"
            ,tate_yoko: "タテ"
            ,shitumonbun: "上司とのコミュニケーションを通じて、<br>信頼関係が築けている"
            },

            {id_no: "MPB-016"
            ,harmony_H: "〇"
            ,harmony_A: "◎"
            ,harmony_R: "〇"
            ,harmony_M: ""
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "タテ"
            ,shitumonbun: "職場で、上司に対して自由に意見を<br>言える雰囲気があると感じる"
            },

            {id_no: "MPB-017"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "◎"
            ,harmony_M: ""
            ,harmony_O: "〇"
            ,harmony_N: ""
            ,tate_yoko: "タテ"
            ,shitumonbun: "上司の判断や行動は、公正で信頼できる"
            },

            {id_no: "MPB-018"
            ,harmony_H: ""
            ,harmony_A: "◎"
            ,harmony_R: "〇"
            ,harmony_M: "〇"
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "タテ"
            ,shitumonbun: "あなたの個性や意見が、上司に受け入れ<br>られていると感じる"
            },

            {id_no: "MPB-019"
            ,harmony_H: ""
            ,harmony_A: "◎"
            ,harmony_R: "〇"
            ,harmony_M: "〇"
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "タテ"
            ,shitumonbun: "上司はあなたの意見や提案に耳を<br>傾けていると感じる"
            },

            {id_no: "MPB-020"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "〇"
            ,harmony_M: ""
            ,harmony_O: ""
            ,harmony_N: "◎"
            ,tate_yoko: "タテ"
            ,shitumonbun: "業務上のミスについて、上司は批判ではなく<br>建設的なフィードバックを行ってくれる"
            },

            {id_no: "MPB-021"
            ,harmony_H: ""
            ,harmony_A: "〇"
            ,harmony_R: "〇"
            ,harmony_M: "◎"
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "ヨコ"
            ,shitumonbun: "同僚同士で、失敗や課題について批判される<br>ことを気にせずにオープンに話し合える"
            },

            {id_no: "MPB-022"
            ,harmony_H: ""
            ,harmony_A: "◎"
            ,harmony_R: "〇"
            ,harmony_M: "〇"
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "ヨコ"
            ,shitumonbun: "同僚との会話で、自分の考えや感情を<br>素直に伝えられる雰囲気がある"
            },

            {id_no: "MPB-023"
            ,harmony_H: ""
            ,harmony_A: "◎"
            ,harmony_R: ""
            ,harmony_M: "〇"
            ,harmony_O: "〇"
            ,harmony_N: ""
            ,tate_yoko: "ヨコ"
            ,shitumonbun: "あなたの意見や提案が、同僚に対して<br>尊重されていると感じる"
            },

            {id_no: "MPB-024"
            ,harmony_H: ""
            ,harmony_A: ""
            ,harmony_R: "◎"
            ,harmony_M: "〇"
            ,harmony_O: "〇"
            ,harmony_N: ""
            ,tate_yoko: "ヨコ"
            ,shitumonbun: "仕事において、同僚に信頼されているという実感がある"
            },

            {id_no: "MPB-043"
            ,harmony_H: "◎"
            ,harmony_A: ""
            ,harmony_R: "〇"
            ,harmony_M: "〇"
            ,harmony_O: ""
            ,harmony_N: ""
            ,tate_yoko: "タテヨコ"
            ,shitumonbun: "チームや上司からの業務サポートが十分に受けられる"
            },

        ];

/*
    //★Question配列の中の順番をシャッフル★//////////////////////////////////////////////////////////////////////////////////
    Question.sort( () => Math.random() - 0.5 ); //Question配列内の順番をシャッフル　※この一行で事足りるらしい・・・
*/
