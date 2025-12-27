"use client";
import { useRef, useState } from "react";
import { getSubs, translateSubs } from "./actions";
export default function page() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<string | null>(null);
    const handleTranscribe = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) return;
        const result = await getSubs(file);
        setResult(result);
        // download result as a sub.srt file
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sub.srt';
        document.body.appendChild(a);
        a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
    }
    const handleTranslate = async () => {
        const result = await translateSubs(text);
        setResult(result);
    }
    return (
        <div className=" p-4 text-white text-2xl">
            <input ref={fileRef} type="file" accept="audio/*" />
            {/* <button onClick={handleTranscribe}>Transcribe</button> */}
            <button onClick={handleTranslate}>TRY</button>
            <pre className="overflow-y-auto w-full">
                {result}
            </pre>
        </div>
    )
}

const text =
    `1
00:00:00,000 --> 00:00:29,980
İzlediğiniz için teşekkür ederim.

2
00:00:30,000 --> 00:00:59,980
İzlediğiniz için teşekkür ederim.

3
00:01:00,000 --> 00:01:29,980
İzlediğiniz için teşekkür ederim.

4
00:01:30,000 --> 00:01:59,980
Altyazı M.K.

5
00:02:00,000 --> 00:02:05,340
Ne oluyor ya?

6
00:02:05,700 --> 00:02:06,220
Yamaç.

7
00:02:22,120 --> 00:02:24,840
Benimle uğraşacaksın.

8
00:02:26,120 --> 00:02:28,760
Benim kadar uyuş olacaksın.

9
00:02:30,000 --> 00:02:30,580
Anadır mı?

10
00:02:32,240 --> 00:02:33,020
Anadır mı?

11
00:02:38,460 --> 00:02:39,840
Hadi şimdi çal bakalım.

12
00:03:00,000 --> 00:03:01,000
Ah!

13
00:03:30,000 --> 00:03:59,980
Altyazı M.K.

14
00:04:00,000 --> 00:04:29,980
İzlediğiniz için teşekkür ederim.

15
00:04:30,000 --> 00:04:33,740
...aydın modelinin çok seçti, çok başarılı bir örneği...

16
00:04:33,740 --> 00:04:34,400
...cumali nerede?

17
00:04:35,280 --> 00:04:36,320
Namaz kılıyor oğlan.

18
00:04:37,480 --> 00:04:38,000
Kahraman.

19
00:04:40,160 --> 00:04:40,760
Senin odanda.

20
00:04:41,560 --> 00:04:42,320
Emmiyle konuşuyorlar.

21
00:04:44,000 --> 00:04:44,900
Kendini söylesene oğlum.

22
00:04:46,040 --> 00:04:46,800
Hizmetçinin mi var?

23
00:04:47,700 --> 00:04:49,460
Aşk olsun baba, ben seviyorum.

24
00:04:50,840 --> 00:04:51,120
Merve.

25
00:04:52,220 --> 00:04:52,540
Söyle.

26
00:04:55,120 --> 00:04:56,460
Çay da gelsin.

27
00:04:57,080 --> 00:04:57,660
Sağ ol kızım.

28
00:05:00,000 --> 00:05:29,980
İzlediğiniz için teşekkür ederim.

29
00:05:30,000 --> 00:05:34,100
Sen de otur dizi başlayın.

30
00:06:00,000 --> 00:06:29,980
İzlediğiniz için teşekkür ederim.

31
00:06:30,000 --> 00:06:32,000
Yasin mi okuyorsun baba?

32
00:06:32,000 --> 00:06:34,000
Öleceğini anladın ha?

33
00:06:38,000 --> 00:06:40,000
Kendimi okumuyorum. Size okuyorum.

34
00:06:44,000 --> 00:06:46,000
Arayın evi daha. Bunun güvendiği birileri var.

35
00:07:00,000 --> 00:07:29,980
İzlediğiniz için teşekkür ederim.

36
00:07:30,000 --> 00:07:59,980
İzlediğiniz için teşekkür ederim.

37
00:08:00,000 --> 00:08:29,980
İzlediğiniz için teşekkür ederim.

38
00:08:30,000 --> 00:08:46,000
Yamaç

39
00:08:46,000 --> 00:08:50,000
Yamaç hadi oğlum

40
00:08:50,000 --> 00:08:52,000
Hadi gel şunlara Yamaç

41
00:08:52,000 --> 00:08:54,000
Hadi hadi çöz

42
00:09:00,000 --> 00:09:07,000
Sakin ol.

43
00:09:07,000 --> 00:09:10,000
Sakin ol.

44
00:09:10,000 --> 00:09:14,000
Senin afkan gereken zaman yaptın.

45
00:09:14,000 --> 00:09:16,000
Ağla.

46
00:09:16,000 --> 00:09:18,000
Burada kal.

47
00:09:18,000 --> 00:09:20,000
Sakin ol.

48
00:09:20,000 --> 00:09:22,000
Sakin ol.

49
00:09:22,000 --> 00:09:24,000
Senin afkan gereken zaman yaptın.

50
00:09:24,000 --> 00:09:26,000
Ağla.

51
00:09:26,000 --> 00:09:28,000
Burada kal.

52
00:09:28,000 --> 00:09:29,600
Burada kal.

53
00:09:30,260 --> 00:09:30,780
Ağlasın.

54
00:09:32,940 --> 00:09:34,420
Dururacağım.

55
00:09:56,000 --> 00:09:59,503
Sadece ikimiz var abi Sadece ikimiz aras abi Sadece ikimiz

56
00:10:21,583 --> 00:10:23,483
Cumali'ye göz kovak ol Mücahit.

57
00:10:25,003 --> 00:10:26,503
Oğlan duracak gibi değil.

58
00:10:26,963 --> 00:10:28,383
Yapabildiğimi yaparım.

59
00:10:28,743 --> 00:10:29,483
Tamam.

60
00:10:29,583 --> 00:10:32,763
İdris ama sen oğlunu benden daha iyi tanıyorsun.

61
00:10:37,383 --> 00:10:39,503
Yamaç olmayaydı bittiydik anne.

62
00:10:40,703 --> 00:10:42,203
Bu gece bittiydik.

63
00:10:43,123 --> 00:10:44,123
Ya.

64
00:10:45,003 --> 00:10:46,123
Dışarıdayım ben.

65
00:10:55,003 --> 00:11:24,983
İzlediğiniz için teşekkür ederim.

66
00:11:25,003 --> 00:11:26,003
Beni neden?

67
00:11:27,243 --> 00:11:30,003
Ya ellerim, ellerim kan oldu ellerim.

68
00:11:30,602 --> 00:11:32,003
Başkasının kanı.

69
00:11:32,303 --> 00:11:34,102
Senin yüzünden beni öldürdüm.

70
00:11:34,403 --> 00:11:35,403
Senin yüzünden!

71
00:11:35,403 --> 00:11:36,703
Ben sana ne dedim?

72
00:11:38,903 --> 00:11:40,803
Her gün namun ucundayız demedin mi?

73
00:11:42,102 --> 00:11:43,602
Her gittiğinde kol kıracaksın.

74
00:11:44,102 --> 00:11:46,003
Ama bizi koruyacaksın demedin mi?

75
00:11:47,003 --> 00:11:48,003
Sen benim kanımsın.

76
00:11:50,403 --> 00:11:51,303
Buna kaçamazsın.

77
00:11:51,903 --> 00:11:54,903
Ya sen, sen insan mısın sen?

78
00:11:55,003 --> 00:11:58,003
Sen insan mısın ve sizsin?

79
00:12:01,003 --> 00:12:02,003
Ben senin babanım.

80
00:12:05,003 --> 00:12:06,003
Bunlar senin ailen.

81
00:12:07,003 --> 00:12:09,003
Burası senin evin, tamam mı?

82
00:12:11,003 --> 00:12:12,003
Bundan kaçamazsın sen.

83
00:12:14,003 --> 00:12:15,003
Yamaç buraya gel!

84
00:12:17,003 --> 00:12:18,003
Buraya gel beni yukarı getirme!

85
00:12:21,003 --> 00:12:22,003
Yamaç!

86
00:12:23,003 --> 00:12:24,003
Yamaç!

87
00:12:25,003 --> 00:12:30,003
O kapıdan çıkarsan...

88
00:12:31,003 --> 00:12:34,003
...bir daha gelemezsin.

89
00:12:38,003 --> 00:12:40,003
Ne ölüme...

90
00:12:41,003 --> 00:12:43,003
...ne ölüne.

91
00:12:55,003 --> 00:13:24,983
Altyazı M.K.

92
00:13:25,003 --> 00:13:29,003
Gidiyorsun.

93
00:13:36,003 --> 00:13:38,003
Demirden korksaydık.

94
00:13:39,003 --> 00:13:40,723
Trene binmezdik aslan parçası.

95
00:13:42,183 --> 00:13:43,042
Ver gelsin bakalım.

96
00:13:55,003 --> 00:14:10,863
Ne oluyor lan?

97
00:14:25,003 --> 00:14:54,983
Altyazı M.K.

98
00:14:55,003 --> 00:14:58,463
Gel.

99
00:15:00,463 --> 00:15:01,823
Gelmeyecek misin?

100
00:15:01,823 --> 00:15:03,443
Peki.

101
00:15:18,563 --> 00:15:20,282
Kes lan şunu!

102
00:15:21,483 --> 00:15:22,443
Ano!

103
00:15:23,443 --> 00:15:24,323
Ne?

104
00:15:25,003 --> 00:15:27,003
Kes şuradan!

105
00:15:27,003 --> 00:15:29,003
Ha pardon!

106
00:15:31,003 --> 00:15:33,003
Ooo yine ölüler cesetler!

107
00:15:34,003 --> 00:15:36,003
Babacım nasılsın?

108
00:15:38,003 --> 00:15:40,003
Kusura bakma!

109
00:15:40,003 --> 00:15:42,003
Müzik biraz yüksekti.

110
00:15:42,003 --> 00:15:44,003
Sen sevmezsin.

111
00:15:44,003 --> 00:15:46,003
Eserler de sevmiyor baba.

112
00:15:46,003 --> 00:15:48,003
Acaba siz kardeş olabilir misiniz acaba?

113
00:15:48,003 --> 00:15:50,003
Haa kötü şakalar!

114
00:15:50,003 --> 00:15:54,003
Yavaş, Çukur, İvrimiz, İdris babamız!

115
00:15:55,003 --> 00:15:57,003
Ne yapıyorsun lan sen?

116
00:15:59,003 --> 00:16:00,003
Sen vardın değil mi?

117
00:16:01,003 --> 00:16:02,003
Sarılar ne istiyorsun?

118
00:16:04,003 --> 00:16:05,003
Oğlum...

119
00:16:05,003 --> 00:16:07,003
İyi misin lan sen?

120
00:16:09,003 --> 00:16:12,003
Önümde diz çökeceksin ve özür dileyeceksin.

121
00:16:16,003 --> 00:16:17,003
Yamaç!

122
00:16:19,003 --> 00:16:21,003
O güzel. O güzel.

123
00:16:21,003 --> 00:16:23,003
Ben de bir şey söyle Serdar'ım benim ya.

124
00:16:23,003 --> 00:16:25,003
Alıyor muyum senayı?

125
00:16:25,003 --> 00:16:27,003
Alıyor muyum babamı?

126
00:16:27,003 --> 00:16:29,003
Bu kadar mıydı?

127
00:16:29,003 --> 00:16:31,003
Hadi bir şey söyle Serdar.

128
00:16:31,003 --> 00:16:35,003
Ah canım Serdar'ım benim ya.

129
00:16:35,003 --> 00:16:37,003
Parmağını kopardık ya.

130
00:16:37,003 --> 00:16:39,003
Hiç iyi yapmadık.

131
00:16:39,003 --> 00:16:41,003
Biz senin parmağını kopardık.

132
00:16:41,003 --> 00:16:43,003
Sen bizim sevdiklerimizi aldın.

133
00:16:43,003 --> 00:16:45,643
Biz senin parmağını kopardık.

134
00:16:46,763 --> 00:16:49,103
Sen bizim sevdiklerimizi aldın.

135
00:16:51,083 --> 00:16:52,063
Büyük amca ama helal.

136
00:16:53,983 --> 00:16:55,542
Ne içtin oğlum sen?

137
00:16:57,282 --> 00:16:58,723
Oğlum sorun da o.

138
00:16:59,483 --> 00:17:00,223
Hiçbir şey içmedim.

139
00:17:01,423 --> 00:17:02,662
Senin sayende böyle oldum ben.

140
00:17:07,042 --> 00:17:07,643
Yavrum.

141
00:17:07,643 --> 00:17:08,522
Şimdi bir oyun oynayacağız.

142
00:17:09,282 --> 00:17:09,983
Benim canım sıkıldı.

143
00:17:11,502 --> 00:17:12,022
Ben ebeğim.

144
00:17:12,022 --> 00:17:14,022
Seninkilerden birini seçeceğim.

145
00:17:14,022 --> 00:17:19,022
Ooo piti piti karamela sepeti.

146
00:17:19,022 --> 00:17:22,022
Terazi lastik cimlastik.

147
00:17:23,022 --> 00:17:25,022
Serdar'ı değil.

148
00:17:25,022 --> 00:17:26,022
Eğil!

149
00:17:30,023 --> 00:17:32,023
Bak babacım, yürütme!

150
00:17:32,023 --> 00:17:34,023
Babacım kendine iyi bak.

151
00:17:34,023 --> 00:17:37,023
Görüşmek üzere. Serdar'ım sen de.

152
00:17:37,023 --> 00:17:39,023
Bak ölme arada bozuşuruz ha.

153
00:17:39,023 --> 00:17:41,023
Çöz verdin bana lan.

154
00:17:42,023 --> 00:17:44,023
Bıcıklar sevgili Barış kardeşlik.

155
00:18:07,023 --> 00:18:08,023
Bildiğin deli lan bu.

156
00:18:10,023 --> 00:18:11,023
Dede! Bu ne?

157
00:18:12,023 --> 00:18:14,203
Böyle bir şey olabilir mi ya?

158
00:18:17,143 --> 00:18:17,863
Yürü.

159
00:18:18,883 --> 00:18:19,563
Beyefendi.

160
00:18:21,783 --> 00:18:23,543
Bizim konuyla alakamız yok.

161
00:18:23,603 --> 00:18:25,403
Biz de çıkabilir miyiz? Çoluk çocuk bayılar evde.

162
00:18:25,742 --> 00:18:27,323
Ne çıkması lan burada kalıyorsunuz.

163
00:18:27,502 --> 00:18:28,043
Biz gidiyoruz.

164
00:18:29,143 --> 00:18:30,123
Yemedi pez emek.

165
00:18:30,843 --> 00:18:32,523
Adam çağır burada kalıyorsun.

166
00:18:33,363 --> 00:18:34,843
Yamacın aklını ikiye böleceğiz.

167
00:18:35,843 --> 00:18:37,823
Gerçi bölünecek fazla bir şey kalmamış ya.

168
00:18:38,763 --> 00:18:39,703
Telefonları da topla.

169
00:18:40,703 --> 00:18:40,982
Yürü.

170
00:18:40,982 --> 00:18:48,063
Hay ben senin yapacağın işi aşırtmanı siktir.

171
00:19:10,982 --> 00:19:12,982
Ömer! Ömer!

172
00:19:27,703 --> 00:19:29,203
Ben gittikten sonra...

173
00:19:30,423 --> 00:19:32,423
...gözlerini ağzına açın.

174
00:19:34,043 --> 00:19:35,423
Nazik davranın.

175
00:19:37,143 --> 00:19:38,143
Anladın mı da?

176
00:19:40,982 --> 00:20:04,325
Efendim Emre Selim Neredesin o

177
00:20:05,705 --> 00:20:06,666
Eve geçiyorum. Ne oldu?

178
00:20:07,806 --> 00:20:08,686
Tombala'da kim var?

179
00:20:09,466 --> 00:20:09,886
Babam.

180
00:20:11,945 --> 00:20:12,686
Nasdektir.

181
00:20:13,486 --> 00:20:14,186
Ne oldu emmi?

182
00:20:15,806 --> 00:20:18,386
Ya şu Serdar mı ne haltsa

183
00:20:18,386 --> 00:20:20,166
tombalayı basmış.

184
00:20:25,006 --> 00:20:26,006
Baba.

185
00:20:36,286 --> 00:20:38,006
Ne var hamona koyun diye var.

186
00:20:38,126 --> 00:20:40,566
Serdar manyaklısın oğlum sen delirdin mi?

187
00:20:40,646 --> 00:20:43,445
Kes lan kes. Canım cicim bitti Selim.

188
00:20:44,085 --> 00:20:46,006
Babanı da aldım. Hadi bakalım.

189
00:20:46,166 --> 00:20:51,166
O kardeşine de söyle başkasına rol yapsın onun Oscar'ını sikerim.

190
00:20:51,686 --> 00:20:53,766
Ne diyorsun Serdar sen ne diyorsun?

191
00:20:53,766 --> 00:20:56,866
Bak oğlum dinle. Sakin ol tamam mı?

192
00:20:56,866 --> 00:21:00,565
Sakin ol bak. Kimseyi tutamayız. Anladın mı?

193
00:21:00,565 --> 00:21:03,065
Palalar, kofar. Anladın mı?

194
00:21:04,866 --> 00:21:07,565
Koçoğlu İdris'i alamazsın oğlum sen.

195
00:21:07,565 --> 00:21:09,266
Sen şu an Çukur'a yürüyorsun.

196
00:21:09,266 --> 00:21:11,565
Sen ne yaptığının farkında değilsin Serdar.

197
00:21:11,565 --> 00:21:14,466
Alayınız gelsin lan, alayınız gelsin.

198
00:21:14,466 --> 00:21:18,666
Delirme. Bak sakin ol delirme. Dinle beni. Dinle beni.

199
00:21:19,666 --> 00:21:21,466
Bak bir anlaşma yapacağız tamam mı?

200
00:21:21,466 --> 00:21:22,806
Sen Yamaç'ın peşindesin.

201
00:21:23,386 --> 00:21:24,246
Yamaç'ın peşindesin.

202
00:21:24,806 --> 00:21:25,886
Ben sana bir güzellik yapacağım.

203
00:21:26,686 --> 00:21:27,886
Sen bana babamı vereceksin.

204
00:21:28,726 --> 00:21:30,065
Ben sana Yamaç'ın karısını vereceğim.

205
00:21:30,126 --> 00:21:30,546
Anladın mı?

206
00:21:31,026 --> 00:21:31,386
Tamam mı?

207
00:21:31,386 --> 00:21:32,426
Babamı serbest bırakacaksın.

208
00:21:32,546 --> 00:21:33,325
Babamı bana vereceksin.

209
00:21:33,446 --> 00:21:33,825
Tamam mı?

210
00:21:34,446 --> 00:21:36,006
Bana ne lan Yamaç'ın karısından?

211
00:21:36,806 --> 00:21:38,146
Serdar delirme dinle beni.

212
00:21:39,366 --> 00:21:41,146
Bak Yamaç delirir.

213
00:21:41,646 --> 00:21:42,886
Kolunu kanadını kırarsın.

214
00:21:43,346 --> 00:21:43,825
Tamam mı?

215
00:21:44,325 --> 00:21:44,886
Çıldırtırsın.

216
00:21:45,506 --> 00:21:46,406
Daha ne yiyecek lan?

217
00:21:46,486 --> 00:21:47,646
Yemiş zaten yiyeceğini.

218
00:21:47,646 --> 00:21:52,646
Tamam lan tamam ama Akoyu. Neredesin sen?

219
00:21:52,646 --> 00:21:59,646
Tamam. İşte bu. Sakin ol. Tamam mı? Ben geleceğim senin yanına.

220
00:21:59,646 --> 00:22:03,646
Önemli değil. Sen neredesin? Sen neredesin?

221
00:22:17,646 --> 00:22:19,406
Ne yapacağız paşam?

222
00:22:25,526 --> 00:22:27,666
Sen bir muhittini buldursana.

223
00:22:28,246 --> 00:22:28,766
Muhittini?

224
00:22:29,766 --> 00:22:30,366
Bu saatte.

225
00:22:31,406 --> 00:22:32,666
Saati mi kaldı emmi?

226
00:22:33,046 --> 00:22:33,766
Saat mi var şimdi?

227
00:22:39,406 --> 00:22:41,186
Uluslar şu muhittini bulsana zaman.

228
00:22:41,705 --> 00:22:42,746
Muhittine bir bakın.

229
00:22:45,226 --> 00:22:46,065
Yamaç.

230
00:22:47,646 --> 00:22:47,906
Oğlum.

231
00:22:48,806 --> 00:22:49,186
Paşam.

232
00:22:50,126 --> 00:22:51,806
Bu fotoğraf nerede çekilmişti hatırlıyor musun?

233
00:22:53,726 --> 00:22:54,046
Hı.

234
00:22:56,046 --> 00:22:57,386
İlk pazarımız.

235
00:22:57,386 --> 00:22:58,065
Ha.

236
00:22:59,366 --> 00:23:00,726
Üstümüze yürüdülerdi.

237
00:23:01,546 --> 00:23:03,946
O zamanlar emmiyle baban ortak.

238
00:23:04,406 --> 00:23:05,946
Ben de yanlarındaki tezgahtayım.

239
00:23:07,146 --> 00:23:07,806
Yirmi kişi.

240
00:23:08,466 --> 00:23:08,906
Akraba.

241
00:23:10,166 --> 00:23:11,926
Bizim pazarımız dediler.

242
00:23:12,085 --> 00:23:13,386
Kaldırın tezgahınız dediler.

243
00:23:15,426 --> 00:23:17,006
Önce baban daldı.

244
00:23:17,006 --> 00:23:18,085
Ardından biz.

245
00:23:19,746 --> 00:23:21,766
İdris'in İdris olduğu gün işte o gün.

246
00:23:24,406 --> 00:23:25,446
Vay be.

247
00:23:26,126 --> 00:23:26,886
Ne günlermiş.

248
00:23:27,686 --> 00:23:28,646
Eee ne yaptınız peki?

249
00:23:30,986 --> 00:23:33,146
Uzun uzun anlatırım ben sana bir gün.

250
00:23:34,246 --> 00:23:35,546
Ama şimdi işimiz var evlat.

251
00:23:36,446 --> 00:23:37,705
Sen söyleyeceksin biz yapacağız.

252
00:23:40,126 --> 00:23:40,926
Salim.

253
00:23:42,046 --> 00:23:42,986
Alişo'yu bulsanıza bana.

254
00:23:43,506 --> 00:23:44,006
Bulayım abi.

255
00:23:47,006 --> 00:23:53,585
Ya ne güzel günlermiş be paşam.

256
00:23:54,205 --> 00:23:54,366
Ha?

257
00:23:55,226 --> 00:23:56,486
Şimdi at vur vur ama.

258
00:23:56,906 --> 00:23:58,546
Vallahi bu hayatın heyecanı meyecanı yok.

259
00:23:59,146 --> 00:24:01,205
Ya sen emredersin olur be aslanım.

260
00:24:01,766 --> 00:24:02,585
Sen emret.

261
00:24:03,046 --> 00:24:04,006
Biz öl de ölelim.

262
00:24:04,266 --> 00:24:04,746
Keselim.

263
00:24:05,065 --> 00:24:05,506
Biçelim.

264
00:24:06,026 --> 00:24:06,506
Dalalım.

265
00:24:07,146 --> 00:24:09,085
Ya gidelim kurtaralım İdris'imizi.

266
00:24:09,705 --> 00:24:10,686
Yok be emmi.

267
00:24:11,305 --> 00:24:11,626
Bir dur.

268
00:24:13,085 --> 00:24:14,366
Çok güzel şey olacaktı.

269
00:24:14,366 --> 00:24:18,585
Ya gerçekten çok güzel şeyler olacak.

270
00:24:25,546 --> 00:24:27,046
Benim bir abim vardı.

271
00:24:29,446 --> 00:24:30,325
Nerede o tombalacı?

272
00:24:44,366 --> 00:25:14,346
Altyazı M.K.

273
00:25:14,366 --> 00:25:27,446
Adımı söyleme.

274
00:25:28,446 --> 00:25:29,266
Ne lan bu hal?

275
00:25:30,546 --> 00:25:31,546
Adımı söyleme.

276
00:25:32,246 --> 00:25:32,946
Tamam hoca.

277
00:25:33,866 --> 00:25:34,626
Söylemeyiz.

278
00:25:36,146 --> 00:25:37,426
Doğru olanı yapıyorsun.

279
00:25:38,126 --> 00:25:39,585
Bak göreceksin her şey daha kolay olacak.

280
00:25:40,325 --> 00:25:41,706
Seninki tombalaya geldi.

281
00:25:42,346 --> 00:25:43,666
Kafa gitmiş.

282
00:25:44,366 --> 00:25:47,085
Sena mena bir şeyler dedi ama anlamamıştım.

283
00:25:48,226 --> 00:25:51,846
Sen var ya çok şerefsiz adamsın yemin ederim.

284
00:25:52,565 --> 00:25:53,866
Niye kaçırdın lan yengeni?

285
00:25:54,886 --> 00:25:56,146
O seni hiç ilgilendirmez.

286
00:25:56,906 --> 00:25:57,906
Şimdi babamı alacağım.

287
00:25:59,085 --> 00:26:01,506
Yamaça sena de sonra başka bir şey deme.

288
00:26:02,446 --> 00:26:04,706
Ne istersen alırsın bak ne istersen diyorum.

289
00:26:05,726 --> 00:26:06,646
Sike sike verecek.

290
00:26:07,386 --> 00:26:08,166
Verir değil mi lan?

291
00:26:08,786 --> 00:26:09,286
Büyük aşk.

292
00:26:10,906 --> 00:26:12,506
Taşaklarından yakaladın öyle düşün.

293
00:26:14,366 --> 00:26:20,085
İdris dedeye söyle bir dahakine bu kadar insaflı olman alırım kellesini.

294
00:26:20,085 --> 00:26:22,085
Tabii canım tamam.

295
00:26:22,085 --> 00:26:24,085
Sen boş ver onu.

296
00:26:24,085 --> 00:26:25,486
Bir defalık çalışmış.

297
00:26:25,486 --> 00:26:27,085
Ne yaptığını bilmiyor.

298
00:26:44,366 --> 00:26:45,766
Aslan parçası.

299
00:26:46,825 --> 00:26:47,166
Ne oldu?

300
00:26:49,565 --> 00:26:50,346
Yine mi geldin lan?

301
00:26:52,366 --> 00:26:52,825
Hoca!

302
00:26:55,166 --> 00:26:57,565
Vazgeçtim. İkisi de bende kalsın.

303
00:27:00,846 --> 00:27:02,065
Lan Serdar!

304
00:27:14,366 --> 00:27:27,366
Zeydol!

305
00:27:27,366 --> 00:27:29,366
Zeydol!

306
00:27:29,366 --> 00:27:30,366
Geçen!

307
00:27:44,065 --> 00:27:45,866
Aç lan şu seni burası!

308
00:27:51,126 --> 00:27:52,126
Beyler...

309
00:27:53,966 --> 00:27:54,966
...ağabey...

310
00:27:56,666 --> 00:27:58,166
...varla bir şeyler.

311
00:27:59,366 --> 00:28:03,166
Anlamadım abi.

312
00:28:05,166 --> 00:28:07,486
Buradan dışarıya çıkabilmek için diyorum.

313
00:28:08,346 --> 00:28:09,666
Var mı yanınızda bir şeyler?

314
00:28:10,466 --> 00:28:11,666
Tırnak makası böyle olur.

315
00:28:15,166 --> 00:28:16,646
Vallahi bende yok abi.

316
00:28:25,646 --> 00:28:26,126
Abi.

317
00:28:29,366 --> 00:28:34,366
Ben de mi var?

318
00:28:41,366 --> 00:28:43,366
Bir şey var mı diye soruyorum.

319
00:28:43,366 --> 00:28:45,366
Celeson tırnak makası bile olur diyorum.

320
00:28:45,366 --> 00:28:47,366
Var desene oğlum niye susuyorsun?

321
00:28:49,366 --> 00:28:51,366
Bu kadar adam.

322
00:28:52,366 --> 00:28:54,366
Ne yapacağım bir tane sus da öyle.

323
00:28:56,366 --> 00:28:58,366
Celeson, celason.

324
00:28:59,366 --> 00:29:01,846
Sen daha ahbini tanrıyorsan.

325
00:29:04,186 --> 00:29:05,186
Nedet...

326
00:29:06,286 --> 00:29:07,786
...anlat bakalım ona...

327
00:29:08,286 --> 00:29:10,286
...Vartolu'ya abin kimmiş?

328
00:29:11,486 --> 00:29:12,646
Vartolu...

329
00:29:13,506 --> 00:29:15,946
...her zaman bir yolunu bulur kardeş.

330
00:29:16,585 --> 00:29:18,585
Bir daha da sana soruldu mu...

331
00:29:19,805 --> 00:29:21,206
...düşünmeyeceksin.

332
00:29:24,846 --> 00:29:26,585
Sana düşün denmedi.

333
00:29:26,585 --> 00:29:29,726
Ne demişler?

334
00:29:31,386 --> 00:29:33,166
Düşü taşın.

335
00:29:33,246 --> 00:29:34,886
Yok tamam Matat uzatma.

336
00:29:43,886 --> 00:29:45,446
Hayırdır Moruk nedir bu durum?

337
00:29:46,346 --> 00:29:49,986
Vallahi gördüğün gibi bildiğin saatli bomba patladı patlayacak.

338
00:29:50,486 --> 00:29:51,106
Hadi Muhittin.

339
00:29:56,585 --> 00:30:04,629
Seni mi g amca He Senin motoru ya yakmaya ba moruk Bildi duman yani

340
00:30:05,449 --> 00:30:09,149
Bunlardan ne yapsınlar demişler bu işi çözse çözse Muhittin Usta çözer.

341
00:30:10,189 --> 00:30:10,949
Laflayalım mı biraz?

342
00:30:20,409 --> 00:30:21,509
Yakma abi.

343
00:30:25,009 --> 00:30:29,089
Dökül bakalım.

344
00:30:31,569 --> 00:30:33,309
Tel koptu abi.

345
00:30:35,249 --> 00:30:37,009
Tel çok fena koptu.

346
00:30:38,129 --> 00:30:39,149
Ya olur öyle.

347
00:30:39,429 --> 00:30:40,389
Tel kopar arada.

348
00:30:41,049 --> 00:30:41,889
Geri bağlarsın.

349
00:30:41,969 --> 00:30:42,769
Mevzu değil yani.

350
00:30:43,949 --> 00:30:44,569
Yok öyle değil.

351
00:30:46,329 --> 00:30:49,109
Yani tutamıyorum kendimi.

352
00:30:52,309 --> 00:30:54,589
İşin kötüsü tutmakla istemiyorum.

353
00:30:55,009 --> 00:30:56,409
İleri.

354
00:30:58,249 --> 00:31:00,209
Yok bilemez.

355
00:31:01,949 --> 00:31:04,949
Bir arkadaşımın motor usikletini almıştım.

356
00:31:06,689 --> 00:31:07,989
Çok da iyi bilmiyorum sürmeyi.

357
00:31:09,589 --> 00:31:10,169
Heves içti.

358
00:31:12,829 --> 00:31:13,949
Yağmur yağmaya başladı.

359
00:31:15,809 --> 00:31:16,729
Yokuş aşağıya gidiyorum.

360
00:31:18,129 --> 00:31:20,289
Kaskın üstündeki damlaları sileyim dedim.

361
00:31:22,069 --> 00:31:23,129
Motor hızlanmaya başladı.

362
00:31:23,129 --> 00:31:25,629
Sıçtık dedim.

363
00:31:27,449 --> 00:31:28,329
Frene asıldım.

364
00:31:30,649 --> 00:31:31,929
Sadece ön frene basmışım.

365
00:31:33,789 --> 00:31:34,929
Arka lastik havalandı.

366
00:31:35,749 --> 00:31:36,949
Ben de motorun üstündeyim.

367
00:31:38,949 --> 00:31:40,769
Abi bir uçuşum var.

368
00:31:43,829 --> 00:31:45,229
Tamam dedim ya.

369
00:31:46,569 --> 00:31:47,009
Ölüyorum.

370
00:31:48,349 --> 00:31:49,069
Buraya kadarmış.

371
00:31:49,069 --> 00:31:53,009
O havadaki o birkaç saniye var ya.

372
00:31:53,129 --> 00:31:57,129
...hani hiçbir şeyi kontrol edemediğin...

373
00:31:57,129 --> 00:32:01,129
...ne yaparsan yap geleni engelleyemediğin...

374
00:32:01,129 --> 00:32:05,129
...müthiş korkutucu...

375
00:32:05,129 --> 00:32:07,129
...ama bir yandan da...

376
00:32:07,129 --> 00:32:11,129
...kendimi daha üzgür hissettiğim bir an var mıydı?

377
00:32:11,129 --> 00:32:13,129
Hatırlamıyorum.

378
00:32:13,129 --> 00:32:15,129
Ben sana delirme diyemiyorum.

379
00:32:15,129 --> 00:32:17,129
Hobi olarak yine delir.

380
00:32:17,129 --> 00:32:19,129
Ama İdris ne olacak?

381
00:32:19,129 --> 00:32:21,129
Sen ha...

382
00:32:21,129 --> 00:32:33,769
İkisi de Serdar'ın elinde.

383
00:32:33,769 --> 00:32:38,249
Serdar kontrol kendisinde sandı.

384
00:32:38,249 --> 00:32:40,369
Beni masaya oturttuğunu sandı.

385
00:32:43,109 --> 00:32:45,669
Biz kopardık.

386
00:32:45,669 --> 00:32:51,729
Kağıtları yedim, masayı devirdim, odayı yıktık.

387
00:32:52,929 --> 00:32:55,429
E şimdi kara kara ne bok yiyeceğini düşünüyor.

388
00:32:56,809 --> 00:32:57,849
Bırakalım öyle kalsın.

389
00:32:58,909 --> 00:33:00,509
Sana da bir laf söylemiştin hatırlıyor musun?

390
00:33:02,269 --> 00:33:05,789
Berber kendi saçını kesemez ama kökünden kazırım.

391
00:33:08,509 --> 00:33:09,549
Kazınmaya başladım abi.

392
00:33:11,109 --> 00:33:11,829
Sonu hayır olsun.

393
00:33:11,829 --> 00:33:15,829
Hepimizin sonu.

394
00:33:19,829 --> 00:33:24,829
Abi Aliço'yu sordurdum. İki gündür kulübesindeymiş. Dışarı çıkmıyormuş.

395
00:33:26,829 --> 00:33:27,829
Hadi.

396
00:33:41,829 --> 00:33:50,529
Gelebilir miyim Aliço?

397
00:33:56,529 --> 00:33:57,569
İzin var mı?

398
00:33:59,049 --> 00:34:00,609
Bu bir tuzağı falan yok değil mi?

399
00:34:07,569 --> 00:34:09,188
Sana ihtiyacım var Aliço.

400
00:34:11,829 --> 00:34:32,188
Ne oldu oğlum?

401
00:34:34,309 --> 00:34:35,688
Üzüm istersen.

402
00:34:35,688 --> 00:35:05,669
Altyazı M.K.

403
00:35:05,689 --> 00:35:06,689
Ne oldu oğlum?

404
00:35:06,689 --> 00:35:08,689
Neyin var oğlum?

405
00:35:08,689 --> 00:35:11,689
Ne yaptılar sana? Cevaplar Aliço.

406
00:35:11,689 --> 00:35:14,689
Kalbini mi kırdılar? Benim kalbimi kırdılar Aliço.

407
00:35:14,689 --> 00:35:16,689
Canım çok acıyor Aliço. Anlat bana Aliço.

408
00:35:16,689 --> 00:35:18,689
Anlat bana Aliço. Anlat bana.

409
00:35:18,689 --> 00:35:19,689
Canım var, anlat.

410
00:35:19,689 --> 00:35:20,689
Çule dayak!

411
00:35:20,689 --> 00:35:22,689
Çule dayak!

412
00:35:22,689 --> 00:35:24,689
Çule dayak!

413
00:35:24,689 --> 00:35:26,689
Çule dayak!

414
00:35:26,689 --> 00:35:27,689
Anladım.

415
00:35:27,689 --> 00:35:29,689
Çule dayak!

416
00:35:29,689 --> 00:35:30,689
Anladım.

417
00:35:30,689 --> 00:35:31,689
Çule dayak!

418
00:35:31,689 --> 00:35:32,689
Anladım.

419
00:35:32,689 --> 00:35:33,689
Çule dayak!

420
00:35:33,689 --> 00:35:40,729
tänker꾼�watch

421
00:35:54,129 --> 00:35:56,209
kulển

422
00:35:56,209 --> 00:35:58,749
hangi

423
00:35:58,749 --> 00:36:00,129
kinda

424
00:36:00,129 --> 00:36:30,109
Altyazı M.K.

425
00:36:30,129 --> 00:36:37,449
İdris Baba.

426
00:36:38,889 --> 00:36:39,489
Sen ha.

427
00:36:41,489 --> 00:36:42,449
Tehlikede.

428
00:36:45,189 --> 00:36:46,989
Bana yardım et Önücio.

429
00:36:56,689 --> 00:36:58,209
Çılatın Önücio.

430
00:37:00,129 --> 00:37:07,729
Anne.

431
00:37:08,429 --> 00:37:10,829
Ben gidiyorum. Var mı bir tiçi?

432
00:37:11,149 --> 00:37:13,209
Yok canım. Allah rahatlık versin.

433
00:37:13,549 --> 00:37:14,249
Hadi size de.

434
00:37:24,409 --> 00:37:26,349
Ödümü patlattın Kemal. Ne oldu?

435
00:37:30,129 --> 00:37:35,529
Sonra da sevgili çocuklar, şimdi ben de senin gibi aranızı olsun.

436
00:37:35,529 --> 00:37:36,629
İdris Baba.

437
00:37:36,629 --> 00:37:38,129
Öh! Kemal!

438
00:37:38,129 --> 00:37:40,629
Ne yapıyorsun evladım? Çeksene elini!

439
00:37:40,629 --> 00:37:42,629
Pardon ol bana.

440
00:37:44,629 --> 00:37:46,629
Ne oldu söylesene Ekten.

441
00:37:46,629 --> 00:37:51,629
Annem, İdris Baba ile Sena ablayı aldılar.

442
00:37:51,629 --> 00:37:53,629
Nasıl aldılar?

443
00:37:53,629 --> 00:37:56,629
Kim aldı?

444
00:37:56,629 --> 00:38:11,809
Bırakma canlan yalnızca biliyorsunuz değil mi bunu?

445
00:38:15,769 --> 00:38:16,729
Biliyorsunuz değil mi lan?

446
00:38:26,629 --> 00:38:27,629
Sena.

447
00:38:27,629 --> 00:38:28,629
Kızım.

448
00:38:28,629 --> 00:38:29,629
Yapılır mı lan bu?

449
00:38:29,629 --> 00:38:30,629
Sena.

450
00:38:30,629 --> 00:38:33,629
Sakin kızım sakin.

451
00:38:33,629 --> 00:38:34,629
Geçecek.

452
00:38:34,629 --> 00:38:35,629
Sabret sabret geçecek.

453
00:38:35,629 --> 00:38:38,909
Sena.

454
00:38:39,909 --> 00:38:40,849
Kızım.

455
00:38:42,009 --> 00:38:42,809
Yapılır mı lan bu?

456
00:38:43,549 --> 00:38:44,449
Sena.

457
00:38:46,789 --> 00:38:48,409
Sakin kızım sakin.

458
00:38:49,629 --> 00:38:50,509
Geçecek.

459
00:38:51,449 --> 00:38:52,769
Sabret sabret geçecek.

460
00:38:59,269 --> 00:39:00,889
Şimdi ne yapıyoruz abi?

461
00:39:05,629 --> 00:39:10,629
Emre'ye paşa Yamaç'ın yanında mı?

462
00:39:11,009 --> 00:39:12,949
Evet anne, hepimiz oradayız.

463
00:39:13,389 --> 00:39:14,189
Alarm durumu yani.

464
00:39:15,209 --> 00:39:15,649
Selim?

465
00:39:16,749 --> 00:39:17,629
Selim abiye...

466
00:39:24,389 --> 00:39:27,109
Ulaşamadık daha ama gelir yani öyle kötü bir haber almadık.

467
00:39:28,069 --> 00:39:29,749
Beni aradıydı zaten.

468
00:39:30,349 --> 00:39:32,189
İşim var biraz gelirim dediydi.

469
00:39:35,629 --> 00:39:36,629
Tık.

470
00:39:39,449 --> 00:39:40,649
İçeri bir girdik.

471
00:39:41,149 --> 00:39:42,589
Bildiğin düğün salonu.

472
00:39:44,589 --> 00:39:46,789
Döndüm Halil'e dedim ki, Kahya...

473
00:39:47,629 --> 00:39:49,729
...biz ne çalacağız oğlum burada?

474
00:39:49,849 --> 00:39:52,849
O da bana döndü dedi ki, işte çifte terli çalacağız...

475
00:39:53,209 --> 00:39:57,029
...düğün havası çalacağız, işte ne gerekiyorsa onu çalacağız, açız it dedi.

476
00:39:57,249 --> 00:39:58,249
Adam haklı.

477
00:39:58,829 --> 00:39:59,889
Ulan tamam da...
`