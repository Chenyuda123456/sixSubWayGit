const fileTypes = [];
const files = import.meta.globEager('/src/assets/subway/*.png');
Object.keys(files).forEach(fileName => {
  let fileType = fileName.match(/([^/]*?)\.[^/.]+$/)[1]; //用正则匹配出文件名称
  fileTypes.push({
    name: fileType,
    iconSrc: files[fileName].default
  });
});
export const getImgSrc = file => {
  let findImg = ''; // 没匹配到就用默认的图片
  fileTypes.forEach(item => item.name === file && (findImg = item.iconSrc));
  return findImg;
};

export const templateSvg = `
<div class="mapWrapper">
    <svg version="1.1" id="LineMap1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
         y="0px"
         viewBox="0 0 6676 7819" style="background-color: #ffffff;width: 100%; height: 100%;" xml:space="preserve">
        <defs>
            <pattern id="stripePattern" width="59" height="18" patternUnits="userSpaceOnUse">
              <image width="59" height="18" x="0" y="0" href="${getImgSrc(
                'bg_river'
              )}"></image>
            </pattern>
        </defs>
        <g id="river">
            <path fill="url(#stripePattern)"
          d="M4546,4176c17,0,31-14,31-31v-218c0-43-70-87-97-87h-6c-31,0-53-25-53-57V3732c0-22-18-40-40-40h-211c-22,0-40,18-40,40v406c0,16,13,29,29,29h0c9,0,17,7,17,17c0,37,0,129,0,170c0,12-9,21-21,21h-0c-14,0-25,11-25,25v448c0,23,15,43,37,50l346,101c32,9,64-14,64-48v-549c0-15-12-28-28-28c-9,0-17-8-17-17v-168C4531,4182,4538,4176,4546,4176z M4509,4342c0,18-15,33-33,33H4233c-18,0-33-15-33-33v-147c0-18,14-39,33-45l110-50c7-3,16-3,23,0l110,50c22,9,33,27,33,45V4342z"/>
            <path fill="url(#stripePattern)"
                  d="M4136,2849h684l52-254c1-7,7-12,15-12h67c9,0,17,8,15,18l-42,221c-2,13,7,26,21,26h308c18,0,35-8,46-23l211-285c27-40,87-39,114,1l199,300c2,4,7,6,12,6h229c18,0,34-13,37-32l188-1270c5-36-23-70-60-70h-399c-46,0-86,34-92,81l-87,624c-0,4-2,8-4,11c-5,7-15,17-30,13c-13-3-19-12-22-19c-1-3-2-7-1-11l78-591c6-46,0-108-46-108h-437c-12,0-22,8-24,20l-179,991c-1,5-6,9-11,9l-74-5c-6-0-11-6-10-13l187-942c6-30-17-59-48-59h-561c-29,0-46,29-51,59l-185,1133c0,0-91,5-96,18c0,0-13,42-18,72c-2,16-5,39-8,58C4108,2835,4121,2849,4136,2849zM5447,2749l57-84c29-42,92-42,120,1l53,84c27,42-3,98-54,98h-125C5449,2849,5418,2791,5447,2749zM6239,2853h-48c-27,0-45-22-45-50l8-64c4-29,26-71,54-71h-4c55-2,89,48,89,98v37C6294,2831,6267,2853,6239,2853z"/>
            <path fill="url(#stripePattern)"
                  d="M2611,5167l-212,2c-18,0-74-77-74-95c-10-70-115-152-174-152l0,0c-47,0-89,43-89,91V5269l0,0c13,107,57,141,171,247h345c41,0,75-33,75-75l2-230C2655,5188,2633,5167,2611,5167z M4158,5255h-205c-28,0-50,22-50,50v76c0,28,22,50,50,50h205c28,0,50-22,50-50v-76C4179,5258,4156,5235,4178,5255z M4646,5419c-39-18-10-54-0-65c2-2,2-6,0-8c-4-5-11-13-29-0c-0,0-1,1-2,2c-5,7-40,46-92,2c-2-2-6-4-9-4c-60-8-91,61-93,86c-0,15-0,31,19,47c20,16-19,73-33,88c-5,9,19,12,42-3c23-16,33-8,44,23s59,37,104-19c37-47,51-56,61-60c5-2,10-7,13-13C4700,5425,4704,5387,4646,5409z"/>
            <path fill="url(#stripePattern)"
                  d="M223,7519h2259c84,0,153-68,153-153v-867c0-25,9-50,25-69l327-381c12-15,31-23,51-23h106c49,0,91-38,94-87c0-4,0-9,0-13c0-9-0-18-1-26c-5-43-42-76-86-76h-408c-12,0-25,5-33,14l-553,596c-8,8-19,13-31,13h-803c-51,0-99,22-132,60l-328,381c-13,15-32,23-52,22c-25-0-61-9-95-42c-21-21-33-42-39-62c-10-32-2-67,20-91l242-269c0,0,101-142,112-160c10-17,15-33,8-55L872,5968c0,0-284-357-657-378v1921C215,7515,219,7519,223,7519zM765,6375l-198,227c-4,5-12,5-16,1l-154-135c-5-4-5-12-1-16l198-230c4-5,12-5,16-1l154,138C769,6363,769,6370,765,6375z"/>
            <path fill="url(#stripePattern)"
                  d="M5474,6255h-327c-22,0-40,18-40,40V6885c0,27,22,45,49,45h45c12,0,24-16,33-25l104-129c10-12,26-19,42-20c35-0,92,1,103,1l0,0c14,0,27-12,27-27v-434C5514,6273,5496,6255,5474,6255zM5005,6756L5005,6756c-5,0-4-4-4-10v-3c0-14,8-20,21-28c4-2,6-7,6-12v-216c0-23-19-42-42-42H4898c-23,0-42,19-42,42v164c0,16,14,34,30,42c6,2,53,32,81,46c3,1,5,6,3,9l0,0c-1,2-4,4-7,4c-40-2-61,0-72,3c-9,2-18,8-23,17c-6,9-11,21-11,26v73c0,30,24,54,54,54h66c30,0,54-24,54-54v-84C5030,6774,5019,6756,5005,6756zM4716,6443c-47,11-139,112-139,112l-0,98c14,10,14,26,14,26s0,60,0,86c0,25-18,25-18,25l2,94c0,24,20,43,44,43h114c24,0,44-20,44-44V6816c0-27-16-30-16-30s0-94,0-106s16-24,16-24s0-97,0-162C4779,6427,4716,6443,4716,6443zM4742,6766c0,13-10,24-24,24h-86c-13,0-24-10-24-24v-84c0-13,10-24,24-24h86c13,0,24,10,24,24V6766z"/>
            <path fill="none" stroke="url(#stripePattern)" stroke-width="58" stroke-linecap="round"
                  d="M6338,5003H6135a210,210,90,0,0,-210,210V7609a210,210,90,0,0,210,210H6338 M5925,5929H3460 M4025,7325V7082a140,140,90,0,0,-140-140H3600a140,140,90,0,1,-140-140V5108a140,140,90,0,0,-140-140H2438a140,140,90,0,1,-140-140V3110A140,140,45,0,0,2258,3010L966,1710"/>
            <text transform="matrix(1 0 0 1 4507 2194)" class="riverT1">
      <tspan x="0" y="0">阳</tspan>
                <tspan x="665" y="0">澄</tspan>
                <tspan x="1330" y="0">湖</tspan>
    </text>
            <text x="4250" y="3936" class="riverT1">金 鸡 湖</text>
            <text x="4250" y="4615" class="riverT1">独 墅 湖</text>
            <text transform="matrix(1 0 0 1 2204 5200)" class="riverT1">
      <tspan x="0" y="0">石</tspan>
                <tspan x="182" y="140">湖</tspan>
    </text>
            <text x="3980" y="5360" class="riverT1">尹山湖</text>
            <text x="4477" y="5475" class="riverT1">镬底潭</text>
            <text transform="matrix(1 0 0 1 760 7156)" class="riverT1">
      <tspan x="0" y="0">太</tspan>
                <tspan x="740" y="0">湖</tspan>
    </text>
            <text transform="matrix(1 0 0 1 4596 6597)" class="riverT1">
      <tspan x="0" y="0">九里湖</tspan>
                <tspan x="0" y="268">同里湖</tspan>
                <tspan x="268" y="0">黄泥兜</tspan>
                <tspan x="268" y="268">沐庄湖</tspan>
    </text>
            <text transform="matrix(1 0 0 1 5178 6558)" class="riverT1">
      <tspan x="0" y="0">澄</tspan>
                <tspan x="190" y="0">湖</tspan>
    </text>
            <text transform="matrix(1 0 0 1 2267 3520)" class="riverT1">
      <tspan x="0" y="0">京</tspan>
                <tspan x="0" y="1133">杭</tspan>
                <tspan x="914" y="1464">大</tspan>
                <tspan x="1164" y="2170">运</tspan>
                <tspan x="1164" y="2930">河</tspan>
    </text>
            <text transform="matrix(1 0 0 1 3946 5945)" class="riverT1">
      <tspan x="0" y="0">吴</tspan>
                <tspan x="625" y="0">淞</tspan>
                <tspan x="1250" y="0">江</tspan>
    </text>
  </g>
        <g id="g1"></g>
    </svg>
    <div id="lineMapMarkers" class="linemap-markers"></div>
 </div>
`;
export const templateSvgStyle = `
 .mapWrapper { position: relative;height: 100%;}
 .linemap-markers { position: absolute; top: 0; left: 0; }
 .bg-color-line1{ background-color:#78BE20; }
 .bg-color-line2{ background-color:#EF3340; }
 .bg-color-line3{ background-color:#FF8200; }
 .bg-color-line4{ background-color:#0072CE; }
 .bg-color-line5{ background-color:#E93CAC; }
 .bg-color-line6{ background-color:#41B6E6; }
 .bg-color-line7{ background-color:#A77BCA; }
 .bg-color-line8{ background-color:#A09200; }
 .bg-color-lineS1{ background-color:#F1C6A7;}
   .bg-color-line-disable{ background-color:#DDDDDD };
        .st {
            fill: none;
            stroke: #FF0000;
            stroke-width: 22;
        }

        .busLine {
            fill: none;
            stroke: #D7E1BB;
            stroke-width: 22;
        }

        .busStation {
            fill: #FFFFFF;
            stroke: #D7E1BB;
            stroke-width: 3;
        }

        .busTransferStation {
            fill: #FFFFFF;
            stroke: #000000;
            stroke-width: 4;
        }

        .busTransferMetro {
            fill: none;
            stroke: #777777;
            stroke-dasharray: 5, 5;
            stroke-width: 2;
        }

        .busRemark {
            fill: #D7E1BB;
        }

        .shLine {
            fill: none;
            stroke: #871A2C;
            stroke-width: 22;
        }

        .busT1 {
            font-family: Microsoft YaHei, SimHei;
            fill: #636363;
            font-size: 45px;
        }

        .busT2 {
            font-family: Microsoft YaHei, SimHei;
            fill: #636363;
            font-size: 36px;
        }

        .busT3 {
            font-family: Microsoft YaHei, SimHei;
            fill: #FFFFFF;
            font-size: 46px;
        }

        .busT4 {
            font-family: Microsoft YaHei, SimHei;
            fill: #FFFFFF;
            font-size: 38px;
        }

        .busT5 {
            font-family: KaiTi;
            fill: #636363;
            font-size: 51px;
        }

        .busT6 {
            font-family: Microsoft YaHei, SimHei;
            fill: #636363;
            font-size: 45px;
        }

        .busT7 {
            font-family: Microsoft YaHei, SimHei;
            fill: #636363;
            font-size: 32px;
        }

        .mountainT1 {
            font-family: KaiTi;
            fill: #636363;
            font-size: 48px;
        }

        .riverT1 {
            font-family: KaiTi;
            fill: #636363;
            font-size: 51px;
            font-style: italic;
        }`;
