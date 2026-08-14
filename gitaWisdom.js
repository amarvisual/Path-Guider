const fs = require('fs');
const path = require('path');

// Keywords that map to specific chapters/topics in the Gita
const TOPIC_MAP = [
  // BATCH 1 — Original 20 + Hindi/Hinglish
  { keywords: ['duty','dharma','responsibility','obligation','right','wrong','kartavya','farz','zimmedari','dharm','sahi galat','apna kaam'], chapters: [3,18] },
  { keywords: ['fear','afraid','anxiety','scared','nervous','panic','worry','worried','darr','ghabrana','chinta','tension','pareshan','dar lagna','dara hua'], chapters: [2,11,18] },
  { keywords: ['grief','sorrow','sad','depressed','depression','cry','loss','mourn','dukh','dard','rona','udaas','gham','takleef','dil dukha','bura lag raha'], chapters: [1,2] },
  { keywords: ['soul','atma','spirit','eternal','immortal','death','die','afterlife','reincarnation','atma','rooh','mrityu','maut','amar','janm mrityu','par loka'], chapters: [2,8,15] },
  { keywords: ['mind','thoughts','overthink','control','restless','calm','focus','concentrate','mann','dimag','soch','vichar','man ko control','bechain','shant'], chapters: [6] },
  { keywords: ['action','work','karma','effort','lazy','laziness','procrastinate','doing','kaam','mehnat','karma','aalas','sust','kuch nahi karna'], chapters: [3,4,5] },
  { keywords: ['knowledge','wisdom','learn','understand','ignorance','truth','education','study','exam','gyan','seekhna','padhai','vidya','samajhna','jaanna'], chapters: [4,7,13,18] },
  { keywords: ['devotion','love','god','worship','faith','prayer','bhakti','surrender','ishwar','puja','mandir','vishwas','shradha','pooja','bhagwan','parmatma'], chapters: [12] },
  { keywords: ['nature','creation','universe','world','maya','illusion','reality','duniya','sansaar','prakriti','srushti','maya jaal','sachchi duniya'], chapters: [7,13,14,15] },
  { keywords: ['renounce','detach','detachment','attachment','desire','want','craving','ego','pride','ahankaar','moh','lobh','ichha','moha','asakti','tyag'], chapters: [5,16,18] },
  { keywords: ['meditation','yoga','practice','discipline','routine','habit','stillness','dhyan','yoga','sadhana','abhyas','tapasya','niyam'], chapters: [6] },
  { keywords: ['anger','rage','hate','jealous','frustrate','bitter','resentment','revenge','gussa','krodh','nafrat','badla','jalana','irritate','chidchidapan'], chapters: [2,3,16] },
  { keywords: ['confusion','dilemma','decision','choice','choose','lost','direction','unsure','confusion','samajh nahi','kya karun','kaisa karun','disha','rasta'], chapters: [2,3,18] },
  { keywords: ['success','failure','win','lose','result','goal','ambition','achieve','safalta','asafalta','haar','jeet','lakshya','kaamyabi','nakamyabi'], chapters: [2,3,4,12] },
  { keywords: ['relationship','love','family','marriage','partner','husband','wife','parent','child','friend','pyar','rishta','parivar','shaadi','dosti','parivaar','patni','pati'], chapters: [1,12] },
  { keywords: ['money','wealth','finance','poor','rich','debt','income','business','profit','loss','paisa','dhan','karz','garib','amir','kamai','vyapaar','nuksan'], chapters: [3,4,16,18] },
  { keywords: ['courage','brave','strength','weak','confidence','doubt','believe','himmat','sahas','kamzori','vishwas','hausla','darr','shakti'], chapters: [2,11,16,18] },
  { keywords: ['peace','happiness','joy','bliss','content','satisfaction','pleasure','pain','sukh','shanti','khushi','dukh','aanand','chain','santusht'], chapters: [2,5,6,12] },
  { keywords: ['career','job','profession','work','calling','purpose','meaning','path','naukri','career','kaam','vyavsay','rasta','uddeshya','jeewan ka maqsad'], chapters: [3,18] },
  { keywords: ['health','sick','illness','body','food','diet','sleep','energy','sehat','bimari','rog','dawa','khaana','nind','thakan','taakat'], chapters: [6,17] },

  // BATCH 2 — 20 more + Hindi/Hinglish
  { keywords: ['parent','parenting','mother','father','son','daughter','child','children','raise','upbringing','maa','baap','mata','pita','beta','beti','bachche','parvarish'], chapters: [1,3,12] },
  { keywords: ['leadership','leader','manage','team','boss','authority','power','influence','guide','neta','netritva','team lead','adhikar','prabhav'], chapters: [3,4,10,18] },
  { keywords: ['forgive','forgiveness','let go','move on','grudge','hurt','betrayal','trust','cheat','deceive','maafi','maaf karna','jaane do','dhoka','vishwasghat'], chapters: [12,16,18] },
  { keywords: ['regret','past','mistake','guilt','shame','wrong decision','should have','could have','pachtawa','galti','sharm','afsoos','pichla','beet gaya'], chapters: [2,4,9,18] },
  { keywords: ['competition','competitor','compare','jealousy','envy','someone better','others success','muqabla','comparison','jalana','doosron se behtar'], chapters: [3,6,12,16] },
  { keywords: ['social pressure','society','expectation','people','opinion','judgment','what will people say','log kya kahenge','samaj','log','duniya ki parwah'], chapters: [2,3,16,18] },
  { keywords: ['patience','wait','waiting','time','slow','when','how long','how much time','sabr','intezaar','wait karna','kitna samay','kab hoga'], chapters: [2,3,12,18] },
  { keywords: ['addiction','habit','bad habit','alcohol','smoking','drugs','screen','phone','stop','lat','buri aadat','sharab','nasha','phone ki lat','chhorna'], chapters: [3,6,16,17] },
  { keywords: ['loneliness','alone','no one','isolated','no friends','no support','abandoned','rejected','akela','tanha','koi nahi','loneliness','andhera'], chapters: [6,9,12] },
  { keywords: ['injustice','unfair','cheated','exploitation','oppression','discrimination','justice','rights','anyay','beinsafi','shoshan','haq','insaaf'], chapters: [2,3,4,16] },
  { keywords: ['spiritual','awakening','enlightenment','moksha','liberation','self realization','consciousness','adhyatm','jagriti','mukti','atm gyan','chetna'], chapters: [4,5,7,8,13,15] },
  { keywords: ['creativity','art','music','writing','design','passion','talent','skill','gift','express','kala','sangeet','rachna','pratibha','hunar','abhivyakti'], chapters: [3,4,10,18] },
  { keywords: ['change','transformation','new beginning','fresh start','restart','change my life','badlav','nayi shuruaat','tabdili','jeewan badlna','naya'], chapters: [2,4,8,14,18] },
  { keywords: ['gratitude','thankful','blessing','appreciate','gift','grace','lucky','fortunate','shukriya','dhanyawaad','ashirwad','naseeb','kripaa'], chapters: [9,10,12,18] },
  { keywords: ['negative','negativity','toxic','negative thoughts','negative people','dark','hopeless','nakaratmak','bura sochna','nirasha','andhakar','haarna'], chapters: [2,6,9,16] },
  { keywords: ['truth','honest','honesty','lie','dishonest','fake','authentic','real','genuine','sachchi','sach','jhooth','asli','naqli','imandari'], chapters: [4,10,16,17] },
  { keywords: ['service','help','giving','charity','volunteer','selfless','donate','others','humanitarian','seva','madad','daan','nishkaam','paropkaar'], chapters: [3,5,12,17] },
  { keywords: ['old age','aging','retire','elderly','grandparent','senior','life review','end of life','budhapa','buddha','naana','daadi','bujurg','jawani gayi'], chapters: [2,8,14,15] },
  { keywords: ['travel','moving','migrate','abroad','new place','new city','homesick','foreign','settle','safar','videsh','naya sheher','ghar chhorna'], chapters: [3,5,6,9] },
  { keywords: ['loss of faith','atheist','doubt god','why god','god is not there','prayer not working','religion','bhagwan nahi','ishwar par shak','dharm','pooja fayda nahi'], chapters: [4,7,9,10,11,12] },

  // BATCH 3 — 40 more + Hindi/Hinglish
  { keywords: ['self love','self care','self worth','self esteem','value myself','i am worthless','not enough','apne aap se pyar','khud ki parwah','main kuch nahi','meri koi value nahi'], chapters: [6,9,12,13] },
  { keywords: ['exam','marks','result','fail exam','pass','study pressure','board','competitive exam','rank','pariksha','result','fail ho gaya','padhai pressure','marks kam'], chapters: [2,4,6,18] },
  { keywords: ['dream','ambition','big dream','vision','impossible','no one believes','they laugh at me','sapna','bada sapna','koi vishwas nahi karta','log hanste hain'], chapters: [3,4,10,11] },
  { keywords: ['divorce','separation','breakup','ex','heartbreak','move on from love','unrequited love','talaq','alag hona','toot gaya dil','pyar mila nahi','break up'], chapters: [2,5,9,12] },
  { keywords: ['business fail','startup','entrepreneur','investor','loss in business','no customers','business duba','nuksaan','grahak nahi','paisa duba','vyapaar bandh'], chapters: [2,3,4,18] },
  { keywords: ['weight','fat','thin','body image','ugly','beautiful','appearance','look','overweight','mota','patla','rang','sundarta','shakal','body weight','dikhta kaisa hoon'], chapters: [6,13,14,17] },
  { keywords: ['sleep','insomnia','nightmare','not sleeping','tired','exhausted','burnout','rest','nind nahi','thaka hua','sapne aate hain','araam nahi','neend'], chapters: [6,14,17] },
  { keywords: ['time management','no time','too busy','deadline','pressure','schedule','productive','samay nahi','bahut busy','deadline','time waste','kaam bahut zyada'], chapters: [3,4,5,18] },
  { keywords: ['politics','corruption','system','government','law','injustice in system','power','rajniti','bhrashtachar','sarkar','kanoon','vyavastha galat'], chapters: [3,4,16,18] },
  { keywords: ['war','conflict','fight','battle','enemy','enemies','opponent','rivalry','yudh','ladai','dushman','virodhi','sangharsh','takkar'], chapters: [1,2,3,11] },
  { keywords: ['grief death','someone died','lost someone','death of loved one','mourning','dead','mrityu','koi mar gaya','koi chala gaya','priyajan kho diya'], chapters: [2,8,9,15] },
  { keywords: ['poverty','very poor','no money','hunger','struggling','survival','basic needs','gareebi','bhookh','bahut garib','guzara mushkil','roti kapda makan'], chapters: [3,4,9,18] },
  { keywords: ['sibling','brother','sister','sibling rivalry','family fight','relatives','joint family','bhai','behan','rishtedaar','parivaar mein jhagda','sanyukta parivar'], chapters: [1,3,12,16] },
  { keywords: ['friend','friendship','best friend','fake friend','friend betrayed','toxic friend','dost','dosti','yaar','nakli dost','dost ne dhoka diya'], chapters: [3,12,16,17] },
  { keywords: ['workplace','colleague','office politics','promotion','boss is bad','workplace stress','office','sahakarmee','promotion nahi mili','bura boss','kaam ka pressure'], chapters: [2,3,4,18] },
  { keywords: ['marriage pressure','arranged marriage','love marriage','parents force','settle down','shaadi ka pressure','rishta','arrange marriage','love marriage','ghar wale force kar rahe'], chapters: [1,2,3,12,18] },
  { keywords: ['religion','ritual','temple','puja','mantra','scripture','hindu','islam','christian','dharm','mandir','masjid','pooja','mantra','geeta','quran'], chapters: [3,7,9,17,18] },
  { keywords: ['environment','pollution','climate','nature destroy','animals','earth','save planet','pradushan','paryavaran','prakriti','janwar','dharti bachao'], chapters: [3,7,9,13,15] },
  { keywords: ['technology','social media','internet','phone addiction','digital life','screen time','mobile','internet ki lat','social media','technology ka asar'], chapters: [3,6,16,17] },
  { keywords: ['reputation','respect','honor','insult','disrespect','humiliate','embarrass','izzat','maan','samman','apman','beizzati','sharm','jhilana'], chapters: [2,3,12,16,17] },
  { keywords: ['overthink','racing thoughts','cannot stop thinking','mind not stopping','constant worry','bahut sochta hoon','zyada sochna','dimag nahi rukta','soch soch ke thak gaya'], chapters: [6,12,18] },
  { keywords: ['purpose life','meaning of life','why am i here','what is life','life purpose','born','jeewan ka uddeshya','main kyun hoon','zindagi ka matlab','jeena kyun'], chapters: [2,7,9,13,15,18] },
  { keywords: ['procrastinate','delay','not starting','putting off','no motivation','lazy','unmotivated','talna','aage dhakhelna','shuru nahi karta','aalas ata hai'], chapters: [3,4,5,18] },
  { keywords: ['greed','selfish','selfishness','greedy','materialistic','too attached to money','lobh','lalach','swarth','paisa hi paisa','bhautik','matlabi'], chapters: [3,14,16,17] },
  { keywords: ['violence','abuse','domestic violence','hurt someone','harm','aggressive','hinsa','maar peet','ghar mein maar','zulm','nuksaan pahunchana'], chapters: [2,3,16,18] },
  { keywords: ['gender','woman','man','discrimination','sexism','equality','feminism','aurat','mard','stri','purush','ling bhed','mahila','samanta'], chapters: [9,13,16,18] },
  { keywords: ['disability','differently abled','handicap','chronic illness','cannot do things','viklang','apang','bimari','ashuddha sharir','main kuch nahi kar sakta'], chapters: [2,5,6,9,13] },
  { keywords: ['suicide','end my life','not worth living','want to die','kill myself','marna chahta','jeena nahi chahta','zindagi khatam','khatm karna chahta','main nahi rehna chahta'], chapters: [2,3,5,9,12,18] },
  { keywords: ['orphan','no parents','abandoned','no family','no roots','where do i belong','anath','maa baap nahi','koi nahi apna','ghar nahi','belong nahi karta'], chapters: [6,9,12,18] },
  { keywords: ['gratitude practice','count blessings','positive thinking','affirmation','mindset','shukriya ada karna','positive sochna','achha sochna','nazar badalna'], chapters: [9,10,12,18] },
  { keywords: ['surrender','let god handle','trust god','give up control','stop controlling','ishwar pe chhod do','bhagwan par bharosa','samarpan','ishwar ki marzi'], chapters: [9,12,18] },
  { keywords: ['ego problem','too proud','arrogant','humility','humble','superiority','inferiority','ahankaar','ghamand','khud ko bada samajhna','namrata','vinamrata'], chapters: [3,13,16,18] },
  { keywords: ['toxic relationship','narcissist','manipulation','gaslighting','abusive partner','zeherila rishta','manipulate karna','jhooth bolna','bura partner'], chapters: [2,3,12,16,18] },
  { keywords: ['community','society contribute','social work','make a difference','leave legacy','samaj seva','badlav lana','samaj ke liye kuch karna','yaad raha jaana'], chapters: [3,5,9,10,18] },
  { keywords: ['wealth management','investment','savings','financial planning','retirement plan','bachat','nivesh','bhavishya ki taiyari','pension','retirement'], chapters: [3,4,16,17,18] },
  { keywords: ['sport','athlete','performance','competition anxiety','winning losing sport','khel','khiladi','performance pressure','jeetna haarna khel mein'], chapters: [2,3,4,11,18] },
  { keywords: ['child raising','teenager','adolescent','rebellious child','parenting teenager','bacche ki parvarish','teen age','ladka nahi maanta','beti nahi sunti'], chapters: [1,3,4,12,16] },
  { keywords: ['meditation beginner','how to meditate','cannot meditate','distracted in meditation','dhyan kaise karun','mann nahi lagta dhyan mein','meditation sikha do'], chapters: [6,12] },
  { keywords: ['simple living','minimalism','less is more','contentment','enough','simple life','sadha jeewan','saral jeewan','kam mein guzaara','santosh','thoda bahut kaafi'], chapters: [2,5,6,12,14] },
  { keywords: ['astrology','planets','numerology','destiny','fate','luck','fortune','sign','zodiac','jyotish','graha','kismat','bhagya','kundli','rashi','numerology'], chapters: [7,8,9,10,13,18] },

  // BATCH 4 — 40 more + Hindi/Hinglish
  { keywords: ['jealous of success','others are ahead','why not me','unfair progress','others doing better','doosre aage hain','mujhe kyun nahi mila','meri mehnat ka fal nahi'], chapters: [2,3,6,12,16] },
  { keywords: ['negative family','toxic parents','controlling parents','strict parents','emotionally abusive family','ghar mein negativity','maa baap control karte','ghar ka mahaul kharab'], chapters: [1,3,16,18] },
  { keywords: ['new job','first day','job change','new workplace','nervous about job','interview','nayi naukri','pehla din','interview ki tension','naya kaam shuru'], chapters: [2,3,4,18] },
  { keywords: ['long distance','missing someone','far from family','separation from loved one','lonely in new city','door rehna','kisi ki yaad','parivar se dur','akela sheher mein'], chapters: [6,9,12,15] },
  { keywords: ['how to be happy','happiness secret','what is true happiness','permanent happiness','real joy','khush kaise rahun','sacchi khushi kya hai','andar se khush rehna','sukh ka raaz'], chapters: [2,5,6,12,14] },
  { keywords: ['overthinking past','past trauma','childhood pain','old wound','past memory','cannot forget','purana dard','bachpan ka dukh','bhul nahi sakta','purani yaadein satati hain'], chapters: [2,4,9,13,18] },
  { keywords: ['future anxiety','scared of future','uncertain future','what will happen','tomorrow','upcoming','kal ki chinta','bhavishya se darr','aage kya hoga','aane wala kal'], chapters: [2,3,8,9,18] },
  { keywords: ['no motivation','feel empty','nothing excites me','lost passion','unmotivated','no energy','kuch nahi karna','mann nahi karta','khali khali lagta','utsaah nahi'], chapters: [3,4,5,6,18] },
  { keywords: ['how to pray','is prayer real','does prayer work','how to connect with god','god connection','pooja kaise karun','kya pooja kaam aati hai','bhagwan se kaise jude','prarthana'], chapters: [7,9,12,18] },
  { keywords: ['karma','my karma','past karma','bad karma','good karma','karma theory','actions and results','mera karma','bura karma','achha karma','karma siddhant','karma ka phal'], chapters: [3,4,5,9,18] },
  { keywords: ['rebirth','reincarnation','past life','next life','previous birth','soul journey','punarjanm','pichhla janm','agla janm','atma ka safar','janm mrityu chakra'], chapters: [2,8,15] },
  { keywords: ['detach from outcome','non attachment','let go of result','outcome dependency','worried about result','phal ki chinta mat karo','result pe mat atko','chhod do'], chapters: [2,3,4,5,18] },
  { keywords: ['inner peace','find peace','peace of mind','calm mind','mental peace','stress free','andar se shanti','mann ki shanti','stress khatam','chain chahiye','sukoon'], chapters: [2,5,6,12,14,18] },
  { keywords: ['self improvement','become better person','personal growth','improve myself','grow','better version','khud ko behtar banana','aatm vikas','andar se badlna','grow karna'], chapters: [3,4,6,13,18] },
  { keywords: ['anger at god','why god','why me','god testing me','god is unfair','unanswered prayers','bhagwan se naraaz','bhagwan ne kyun kiya','meri pooja bekar gayi'], chapters: [4,7,9,11,18] },
  { keywords: ['cope with loss','loss of job','lost everything','starting over','rock bottom','failure recovery','sab kuch kho diya','nayi shuruaat','toot gaya','ab kya karun'], chapters: [2,4,9,12,18] },
  { keywords: ['trust issues','cannot trust anyone','been betrayed','everyone leaves','people hurt me','kisi par bharosa nahi','sab ne dhoka diya','koi sach nahi bolta'], chapters: [3,9,12,16,18] },
  { keywords: ['hard work not paying','effort not rewarded','working hard no result','deserve more','not recognized','mehnat ka phal nahi','koi notice nahi karta','itni mehnat bekar gayi'], chapters: [2,3,4,5,18] },
  { keywords: ['hate my life','life is hard','life is painful','why is life so difficult','tired of life','zindagi se nafrat','jeena mushkil','zindagi dard deti hai','thak gaya hoon'], chapters: [2,5,9,12,14,18] },
  { keywords: ['control emotions','emotional','too sensitive','cry easily','emotionally weak','emotions overwhelming','emotions control nahi','bahut emotional hoon','rona aa jata','dil bhar aata'], chapters: [2,6,12,14,18] },
  { keywords: ['bad thoughts','sinful thoughts','impure mind','lustful thoughts','evil thoughts','dark thoughts','bure vichar','galat soch','mann mein bura aata','paap ki soch'], chapters: [3,6,9,16,17] },
  { keywords: ['vegetarian','non vegetarian','diet ethics','food choice','sattvic food','tamasic','rajasic','saatvik khana','tamasic khana','rajasic','shakahari','maasahari'], chapters: [17] },
  { keywords: ['caste','untouchability','discrimination by birth','varna','social hierarchy','brahmin','sudra','jati','jati bhed','varna vyavastha','chhoot','shudra'], chapters: [4,9,18] },
  { keywords: ['dream job','passion vs stability','follow dreams or be practical','risky career','safe job','sapno ki naukri','passion ya stability','khwaab ka kaam','safe rehun ya risk lun'], chapters: [2,3,18] },
  { keywords: ['feeling unworthy','not deserving','imposter syndrome','fake success','lucky not talented','main layak nahi','mujhe nahi milna chahiye tha','main fake hoon','luck se mila'], chapters: [2,3,9,13,18] },
  { keywords: ['midlife crisis','40s crisis','life review','half life','what have i done','time running out','adhi umar','40 saal','abhi tak kya kiya','waqt nikal gaya'], chapters: [2,4,8,14,18] },
  { keywords: ['introvert','shy','social anxiety','cannot speak in public','stage fear','social fear','sharmila','log ke saamne baat nahi kar sakta','stage darr','public speaking'], chapters: [2,3,6,16,18] },
  { keywords: ['leadership struggle','cannot motivate team','team not listening','managing people','people management','team ko kaise chalayein','log nahi mante','team motivate karna'], chapters: [3,4,10,16,18] },
  { keywords: ['insecurity','feel insecure','not good enough','always comparing','self image issue','surakshit nahi lagta','khud pe vishwas nahi','hamesha compare karta hoon'], chapters: [2,3,6,13,16] },
  { keywords: ['help someone','how to help a friend','friend in pain','supporting others','counsel others','dost ki madad karna','kisi ko kaise sambhaalon','kisi ke saath khada rehna'], chapters: [3,5,9,12,17] },
  { keywords: ['power of now','present moment','live in present','mindfulness','here and now','awareness','abhi ka pal','vartaman mein jeena','is pal mein rehna','sach mein jaagna'], chapters: [2,5,6,13,18] },
  { keywords: ['free will','choice','do i have control','is everything destined','can i change fate','swatantr icha','kya mera control hai','sab pehle se likha hai','kismat badal sakti'], chapters: [3,4,13,18] },
  { keywords: ['war within','internal conflict','fighting with myself','two minds','inner battle','andar ki ladai','khud se ladhna','do mann','man mein sangharsh','andar kuch toot raha'], chapters: [1,2,3,6,18] },
  { keywords: ['discrimination','bias','prejudice','racism','casteism','sexism','stereotype','bhedbhav','pakshapat','jaati bhed','rang bhed','ling bhed'], chapters: [9,13,16,18] },
  { keywords: ['online hate','trolling','cyberbullying','social media hate','comments','criticism online','online gaali','trolling','social media pe hate','log bura bolte online'], chapters: [2,12,16,18] },
  { keywords: ['broken home','dysfunctional family','no stability','unstable childhood','trauma background','tuta hua ghar','ghar mein shanti nahi','bachpan mein takleef','ghar theek nahi tha'], chapters: [1,2,9,12,18] },
  { keywords: ['ego clash','argument','stubborn','nobody understands me','communication issue','misunderstood','koi samjhta nahi','seedhi baat nahi hoti','main galat samjha gaya'], chapters: [2,3,13,16,18] },
  { keywords: ['fear of failure','failure phobia','scared to try','what if i fail','paralyzed by fear','fail hone ka darr','koshish karne se darr','agar fail hua to','darr ke baithna'], chapters: [2,3,4,18] },
  { keywords: ['lost in maya','materialism','chasing things','consumerism','never satisfied','always wanting more','maya mein khoya','sab paana chahta','kabhi santusht nahi','aur chahiye'], chapters: [5,7,14,16,18] },
  { keywords: ['blessing in disguise','good from bad','silver lining','hidden lesson','everything happens for reason','burai mein bhalai','mushkil mein sabak','bhagwan ki marzi mein khair','jo hota achhe ke liye hota'], chapters: [2,4,9,10,18] },


  { keywords: ['anger','rage','hate','jealous','frustrate','bitter','resentment','revenge'], chapters: [2,3,16] },
  { keywords: ['confusion','dilemma','decision','choice','choose','lost','direction','unsure'], chapters: [2,3,18] },
  { keywords: ['success','failure','win','lose','result','goal','ambition','achieve'], chapters: [2,3,4,12] },
  { keywords: ['relationship','love','family','marriage','partner','husband','wife','parent','child','friend'], chapters: [1,12] },
  { keywords: ['money','wealth','finance','poor','rich','debt','income','business','profit','loss'], chapters: [3,4,16,18] },
  { keywords: ['courage','brave','strength','weak','confidence','doubt','believe'], chapters: [2,11,16,18] },
  { keywords: ['peace','happiness','joy','bliss','content','satisfaction','pleasure','pain'], chapters: [2,5,6,12] },
  { keywords: ['career','job','profession','work','calling','purpose','meaning','path'], chapters: [3,18] },
  { keywords: ['health','sick','illness','body','food','diet','sleep','energy'], chapters: [6,17] },

  // NEW 20 — added May 2026
  { keywords: ['parent','parenting','mother','father','son','daughter','child','children','raise','upbringing'], chapters: [1,3,12] },
  { keywords: ['leadership','leader','manage','team','boss','authority','power','influence','guide'], chapters: [3,4,10,18] },
  { keywords: ['forgive','forgiveness','let go','move on','grudge','hurt','betrayal','trust','cheat','deceive'], chapters: [12,16,18] },
  { keywords: ['regret','past','mistake','guilt','shame','wrong decision','should have','could have'], chapters: [2,4,9,18] },
  { keywords: ['competition','competitor','compare','jealousy','envy','someone better','others success'], chapters: [3,6,12,16] },
  { keywords: ['social pressure','society','expectation','people','opinion','judgment','what will people say','log kya kahenge'], chapters: [2,3,16,18] },
  { keywords: ['patience','wait','waiting','time','slow','when','how long','how much time'], chapters: [2,3,12,18] },
  { keywords: ['addiction','habit','bad habit','alcohol','smoking','drugs','screen','phone','porn','stop'], chapters: [3,6,16,17] },
  { keywords: ['loneliness','alone','no one','isolated','no friends','no support','abandoned','rejected'], chapters: [6,9,12] },
  { keywords: ['injustice','unfair','cheated','exploitation','oppression','discrimination','justice','rights'], chapters: [2,3,4,16] },
  { keywords: ['spiritual','awakening','enlightenment','moksha','liberation','self realization','consciousness'], chapters: [4,5,7,8,13,15] },
  { keywords: ['creativity','art','music','writing','design','passion','talent','skill','gift','express'], chapters: [3,4,10,18] },
  { keywords: ['change','transformation','new beginning','fresh start','restart','change my life'], chapters: [2,4,8,14,18] },
  { keywords: ['gratitude','thankful','blessing','appreciate','gift','grace','lucky','fortunate'], chapters: [9,10,12,18] },
  { keywords: ['negative','negativity','toxic','negative thoughts','negative people','dark','hopeless'], chapters: [2,6,9,16] },
  { keywords: ['truth','honest','honesty','lie','dishonest','fake','authentic','real','genuine'], chapters: [4,10,16,17] },
  { keywords: ['service','help','giving','charity','volunteer','selfless','donate','others','humanitarian'], chapters: [3,5,12,17] },
  { keywords: ['old age','aging','retire','elderly','grandparent','senior','life review','end of life'], chapters: [2,8,14,15] },
  { keywords: ['travel','moving','migrate','abroad','new place','new city','homesick','foreign','settle'], chapters: [3,5,6,9] },
  { keywords: ['loss of faith','atheist','doubt god','why god','god is not there','prayer not working','religion'], chapters: [4,7,9,10,11,12] },

  // BATCH 3 — 40 more categories
  { keywords: ['self love','self care','self worth','self esteem','value myself','i am worthless','not enough'], chapters: [6,9,12,13] },
  { keywords: ['exam','marks','result','fail exam','pass','study pressure','board','competitive exam','rank'], chapters: [2,4,6,18] },
  { keywords: ['dream','ambition','big dream','vision','impossible','no one believes','they laugh at me'], chapters: [3,4,10,11] },
  { keywords: ['divorce','separation','breakup','ex','heartbreak','move on from love','unrequited love'], chapters: [2,5,9,12] },
  { keywords: ['business fail','startup','entrepreneur','investor','loss in business','no customers'], chapters: [2,3,4,18] },
  { keywords: ['weight','fat','thin','body image','ugly','beautiful','appearance','look','overweight'], chapters: [6,13,14,17] },
  { keywords: ['sleep','insomnia','nightmare','not sleeping','tired','exhausted','burnout','rest'], chapters: [6,14,17] },
  { keywords: ['time management','no time','too busy','deadline','pressure','schedule','productive'], chapters: [3,4,5,18] },
  { keywords: ['politics','corruption','system','government','law','injustice in system','power'], chapters: [3,4,16,18] },
  { keywords: ['war','conflict','fight','battle','enemy','enemies','opponent','rivalry'], chapters: [1,2,3,11] },
  { keywords: ['grief death','someone died','lost someone','death of loved one','mourning','dead'], chapters: [2,8,9,15] },
  { keywords: ['poverty','very poor','no money','hunger','struggling','survival','basic needs'], chapters: [3,4,9,18] },
  { keywords: ['sibling','brother','sister','sibling rivalry','family fight','relatives','joint family'], chapters: [1,3,12,16] },
  { keywords: ['friend','friendship','best friend','fake friend','friend betrayed','toxic friend'], chapters: [3,12,16,17] },
  { keywords: ['workplace','colleague','office politics','promotion','boss is bad','workplace stress'], chapters: [2,3,4,18] },
  { keywords: ['marriage pressure','arranged marriage','love marriage','parents force','settle down'], chapters: [1,2,3,12,18] },
  { keywords: ['religion','ritual','temple','puja','mantra','scripture','hindu','islam','christian'], chapters: [3,7,9,17,18] },
  { keywords: ['environment','pollution','climate','nature destroy','animals','earth','save planet'], chapters: [3,7,9,13,15] },
  { keywords: ['technology','social media','internet','phone addiction','digital life','screen time'], chapters: [3,6,16,17] },
  { keywords: ['reputation','respect','honor','insult','disrespect','humiliate','embarrass'], chapters: [2,3,12,16,17] },
  { keywords: ['overthink','racing thoughts','cannot stop thinking','mind not stopping','constant worry'], chapters: [6,12,18] },
  { keywords: ['purpose life','meaning of life','why am i here','what is life','life purpose','born'], chapters: [2,7,9,13,15,18] },
  { keywords: ['procrastinate','delay','not starting','putting off','no motivation','lazy','unmotivated'], chapters: [3,4,5,18] },
  { keywords: ['greed','selfish','selfishness','greedy','materialistic','too attached to money'], chapters: [3,14,16,17] },
  { keywords: ['violence','abuse','domestic violence','hurt someone','harm','aggressive'], chapters: [2,3,16,18] },
  { keywords: ['gender','woman','man','discrimination','sexism','equality','feminism'], chapters: [9,13,16,18] },
  { keywords: ['disability','differently abled','handicap','chronic illness','cannot do things'], chapters: [2,5,6,9,13] },
  { keywords: ['suicide','end my life','not worth living','want to die','kill myself'], chapters: [2,3,5,9,12,18] },
  { keywords: ['orphan','no parents','abandoned','no family','no roots','where do i belong'], chapters: [6,9,12,18] },
  { keywords: ['gratitude practice','count blessings','positive thinking','affirmation','mindset'], chapters: [9,10,12,18] },
  { keywords: ['surrender','let god handle','trust god','give up control','stop controlling'], chapters: [9,12,18] },
  { keywords: ['ego problem','too proud','arrogant','humility','humble','superiority','inferiority'], chapters: [3,13,16,18] },
  { keywords: ['toxic relationship','narcissist','manipulation','gaslighting','abusive partner'], chapters: [2,3,12,16,18] },
  { keywords: ['community','society contribute','social work','make a difference','leave legacy'], chapters: [3,5,9,10,18] },
  { keywords: ['wealth management','investment','savings','financial planning','retirement plan'], chapters: [3,4,16,17,18] },
  { keywords: ['sport','athlete','performance','competition anxiety','winning losing sport'], chapters: [2,3,4,11,18] },
  { keywords: ['child raising','teenager','adolescent','rebellious child','parenting teenager'], chapters: [1,3,4,12,16] },
  { keywords: ['meditation beginner','how to meditate','cannot meditate','distracted in meditation'], chapters: [6,12] },
  { keywords: ['simple living','minimalism','less is more','contentment','enough','simple life'], chapters: [2,5,6,12,14] },
  { keywords: ['astrology','planets','numerology','destiny','fate','luck','fortune','sign','zodiac'], chapters: [7,8,9,10,13,18] },

  // BATCH 4 — 40 more categories
  { keywords: ['jealous of success','others are ahead','why not me','unfair progress','others doing better'], chapters: [2,3,6,12,16] },
  { keywords: ['negative family','toxic parents','controlling parents','strict parents','emotionally abusive family'], chapters: [1,3,16,18] },
  { keywords: ['new job','first day','job change','new workplace','nervous about job','interview'], chapters: [2,3,4,18] },
  { keywords: ['long distance','missing someone','far from family','separation from loved one','lonely in new city'], chapters: [6,9,12,15] },
  { keywords: ['how to be happy','happiness secret','what is true happiness','permanent happiness','real joy'], chapters: [2,5,6,12,14] },
  { keywords: ['overthinking past','past trauma','childhood pain','old wound','past memory','cannot forget'], chapters: [2,4,9,13,18] },
  { keywords: ['future anxiety','scared of future','uncertain future','what will happen','tomorrow','upcoming'], chapters: [2,3,8,9,18] },
  { keywords: ['no motivation','feel empty','nothing excites me','lost passion','unmotivated','no energy'], chapters: [3,4,5,6,18] },
  { keywords: ['how to pray','is prayer real','does prayer work','how to connect with god','god connection'], chapters: [7,9,12,18] },
  { keywords: ['karma','my karma','past karma','bad karma','good karma','karma theory','actions and results'], chapters: [3,4,5,9,18] },
  { keywords: ['rebirth','reincarnation','past life','next life','previous birth','soul journey'], chapters: [2,8,15] },
  { keywords: ['detach from outcome','non attachment','let go of result','outcome dependency','worried about result'], chapters: [2,3,4,5,18] },
  { keywords: ['inner peace','find peace','peace of mind','calm mind','mental peace','stress free'], chapters: [2,5,6,12,14,18] },
  { keywords: ['self improvement','become better person','personal growth','improve myself','grow','better version'], chapters: [3,4,6,13,18] },
  { keywords: ['anger at god','why god','why me','god testing me','god is unfair','unanswered prayers'], chapters: [4,7,9,11,18] },
  { keywords: ['cope with loss','loss of job','lost everything','starting over','rock bottom','failure recovery'], chapters: [2,4,9,12,18] },
  { keywords: ['trust issues','cannot trust anyone','been betrayed','everyone leaves','people hurt me'], chapters: [3,9,12,16,18] },
  { keywords: ['hard work not paying','effort not rewarded','working hard no result','deserve more','not recognized'], chapters: [2,3,4,5,18] },
  { keywords: ['hate my life','life is hard','life is painful','why is life so difficult','tired of life'], chapters: [2,5,9,12,14,18] },
  { keywords: ['control emotions','emotional','too sensitive','cry easily','emotionally weak','emotions overwhelming'], chapters: [2,6,12,14,18] },
  { keywords: ['bad thoughts','sinful thoughts','impure mind','lustful thoughts','evil thoughts','dark thoughts'], chapters: [3,6,9,16,17] },
  { keywords: ['vegetarian','non vegetarian','diet ethics','food choice','sattvic food','tamasic','rajasic'], chapters: [17] },
  { keywords: ['caste','untouchability','discrimination by birth','varna','social hierarchy','brahmin','sudra'], chapters: [4,9,18] },
  { keywords: ['dream job','passion vs stability','follow dreams or be practical','risky career','safe job'], chapters: [2,3,18] },
  { keywords: ['feeling unworthy','not deserving','imposter syndrome','fake success','lucky not talented'], chapters: [2,3,9,13,18] },
  { keywords: ['midlife crisis','40s crisis','life review','half life','what have i done','time running out'], chapters: [2,4,8,14,18] },
  { keywords: ['introvert','shy','social anxiety','cannot speak in public','stage fear','social fear'], chapters: [2,3,6,16,18] },
  { keywords: ['leadership struggle','cannot motivate team','team not listening','managing people','people management'], chapters: [3,4,10,16,18] },
  { keywords: ['insecurity','feel insecure','not good enough','always comparing','self image issue'], chapters: [2,3,6,13,16] },
  { keywords: ['help someone','how to help a friend','friend in pain','supporting others','counsel others'], chapters: [3,5,9,12,17] },
  { keywords: ['power of now','present moment','live in present','mindfulness','here and now','awareness'], chapters: [2,5,6,13,18] },
  { keywords: ['free will','choice','do i have control','is everything destined','can i change fate'], chapters: [3,4,13,18] },
  { keywords: ['war within','internal conflict','fighting with myself','two minds','inner battle'], chapters: [1,2,3,6,18] },
  { keywords: ['discrimination','bias','prejudice','racism','casteism','sexism','stereotype'], chapters: [9,13,16,18] },
  { keywords: ['online hate','trolling','cyberbullying','social media hate','comments','criticism online'], chapters: [2,12,16,18] },
  { keywords: ['broken home','dysfunctional family','no stability','unstable childhood','trauma background'], chapters: [1,2,9,12,18] },
  { keywords: ['ego clash','argument','stubborn','nobody understands me','communication issue','misunderstood'], chapters: [2,3,13,16,18] },
  { keywords: ['fear of failure','failure phobia','scared to try','what if i fail','paralyzed by fear'], chapters: [2,3,4,18] },
  { keywords: ['lost in maya','materialism','chasing things','consumerism','never satisfied','always wanting more'], chapters: [5,7,14,16,18] },
  { keywords: ['blessing in disguise','good from bad','silver lining','hidden lesson','everything happens for reason'], chapters: [2,4,9,10,18] },
];

let gitaVerses = null;

function loadVerses() {
  const filePath = path.join(__dirname, 'gita_full.json');
  if (fs.existsSync(filePath)) {
    gitaVerses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ Loaded ${gitaVerses.length} Gita verses for local matching`);
    return true;
  }
  return false;
}

// ─── SMART MATCHING ENGINE ───────────────────────────────────────────────────

// 1. Simple English stemmer — strips common suffixes so "worrying"→"worry", "feared"→"fear"
function stem(word) {
  return word
    .replace(/ing$/, '').replace(/tion$/, '').replace(/ed$/, '')
    .replace(/ness$/, '').replace(/ment$/, '').replace(/ly$/, '')
    .replace(/er$/, '').replace(/est$/, '').replace(/ful$/, '')
    .replace(/less$/, '').replace(/ies$/, 'y').replace(/s$/, '');
}

// 2. Tokenize input into individual words + stems
function tokenize(text) {
  const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const stems = words.map(stem);
  return { words, stems, fullText: text.toLowerCase() };
}

// 3. Score a single category against the tokenized input
function scoreCategory(topic, tokens) {
  let score = 0;
  for (const kw of topic.keywords) {
    const kwLower = kw.toLowerCase();
    const kwWords = kwLower.split(/\s+/);

    // A) Exact full phrase match in text → highest score (weight = keyword length * 3)
    if (tokens.fullText.includes(kwLower)) {
      score += kwWords.length * 3;
      continue;
    }

    // B) Every word of multi-word keyword matches some token/stem → good match
    if (kwWords.length > 1) {
      const allMatch = kwWords.every(kw =>
        tokens.words.includes(kw) || tokens.stems.includes(stem(kw)) ||
        tokens.fullText.includes(kw)
      );
      if (allMatch) { score += kwWords.length * 2; continue; }

      // Partial: at least half the keyword words match
      const matchCount = kwWords.filter(kw =>
        tokens.words.includes(kw) || tokens.stems.includes(stem(kw))
      ).length;
      if (matchCount >= Math.ceil(kwWords.length / 2)) {
        score += matchCount;
        continue;
      }
    }

    // C) Single word keyword: exact token match → weight 2
    if (tokens.words.includes(kwLower) || tokens.stems.includes(stem(kwLower))) {
      score += 2;
      continue;
    }

    // D) Fuzzy: keyword is substring of any token or token is substring of keyword
    // (handles "darr" matching "darrta", "ghabra" matching "ghabrana")
    const fuzzyMatch = tokens.words.some(w =>
      (w.length >= 4 && kwLower.includes(w)) || (kwLower.length >= 4 && w.includes(kwLower))
    );
    if (fuzzyMatch) { score += 1; }
  }
  return score;
}

function getGitaWisdom(name, problem) {
  if (!gitaVerses) loadVerses();
  if (!gitaVerses || gitaVerses.length === 0) return getHardcodedWisdom(name, problem);

  const tokens = tokenize(problem || '');

  // Score ALL categories
  const scored = TOPIC_MAP.map(topic => ({
    topic,
    score: scoreCategory(topic, tokens)
  })).sort((a, b) => b.score - a.score);

  const topScore = scored[0].score;

  let chapterPool;
  if (topScore === 0) {
    // No match at all → use ALL 701 verses (random wisdom)
    chapterPool = null;
  } else {
    // Blend top categories whose score is within 50% of the best score
    // This gives variety and handles questions touching multiple topics
    const threshold = Math.max(1, topScore * 0.5);
    const topCategories = scored.filter(s => s.score >= threshold).slice(0, 5);

    // Collect unique chapters from all top categories (weighted by score)
    const chapterScores = {};
    for (const { topic, score } of topCategories) {
      for (const ch of topic.chapters) {
        chapterScores[ch] = (chapterScores[ch] || 0) + score;
      }
    }

    // Sort chapters by total score, keep top chapters
    chapterPool = Object.entries(chapterScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([ch]) => Number(ch));
  }

  // Filter verse pool
  let pool = chapterPool
    ? gitaVerses.filter(v => chapterPool.includes(v.chapter))
    : gitaVerses;

  // Fallback: if pool is empty for some reason
  if (!pool.length) pool = gitaVerses;

  // Pick random verse, weighted toward earlier (more famous) verses within each chapter
  const verse = pool[Math.floor(Math.random() * pool.length)];
  const guidance = buildGuidance(name, problem, verse, topScore, scored[0]);

  return `---SLOKA---\n${verse.sloka || 'ॐ'}\n---REFERENCE---\nBhagavad Gita - Chapter ${verse.chapter}, Verse ${verse.verse}\n---TRANSLITERATION---\n${verse.transliteration || ''}\n---HINDI---\n${verse.hindi || 'कर्म करते रहो, फल की चिंता मत करो।'}\n---ENGLISH---\n${verse.english || 'Perform your duty without attachment to results.'}\n---GUIDANCE---\n${guidance}`;
}

function buildGuidance(name, problem, verse, score, topMatch) {
  const english = verse.english || verse.purport || 'Perform your duty with full dedication.';
  const isStrong = score >= 3;
  const opening = isStrong
    ? `Dear ${name}, your question has led you to exactly the right wisdom. Lord Krishna speaks directly to you through this verse from Chapter ${verse.chapter}:`
    : `Dear ${name}, the Bhagavad Gita holds the answer to what your heart seeks. Lord Krishna offers this timeless wisdom:`;

  return `${opening}\n\n${english}\n\nThis ancient wisdom directly addresses what you are going through. The path forward requires neither force nor worry — only steady, faithful action aligned with your highest self. Trust in the divine plan that is already unfolding for you.\n\nWalk forward with courage and faith, dear ${name}. You are never alone. The same Krishna who guided Arjuna on the battlefield of Kurukshetra walks beside you on the battlefield of your life. 🙏`;
}


// Hardcoded fallback if JSON not downloaded yet
function getHardcodedWisdom(name, problem) {
  const text = (problem||'').toLowerCase();
  const entries = [
    { keys:['stuck','progress','slow','result'], ch:2, v:47, s:'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', tr:'Karmanye vadhikaraste Ma Phaleshu Kadachana', hi:'कर्म करो, फल की चिंता मत करो।', en:'You have the right to perform your duties, but never to the fruits of your actions.' },
    { keys:['fear','anxiety','scared','worried','stress'], ch:2, v:3, s:'क्लैब्यं मा स्म गमः पार्थ।', tr:'Klaibyam ma sma gamah Partha', hi:'हे पार्थ, कायरता को मत प्राप्त हो।', en:'Do not yield to impotence. Shake off faint-heartedness and arise.' },
    { keys:['sad','lost','depressed','hopeless','alone','lonely'], ch:2, v:16, s:'नासतो विद्यते भावो नाभावो विद्यते सतः।', tr:'Nasato vidyate bhavo nabhavo vidyate satah', hi:'असत् का अस्तित्व नहीं और सत् का अभाव नहीं।', en:'The unreal has no existence; the real never ceases to be.' },
    { keys:['anger','rage','hate','jealous','frustrated'], ch:2, v:63, s:'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।', tr:'Krodhad bhavati sammohah', hi:'क्रोध से सम्मोह और सम्मोह से विनाश होता है।', en:'From anger arises delusion, from delusion loss of memory and ultimately destruction.' },
    { keys:['career','job','purpose','direction','meaning'], ch:3, v:35, s:'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।', tr:'Shreyaan swadharmo vigunah paradharmat', hi:'अपना अधूरा धर्म दूसरे के पूर्ण धर्म से श्रेष्ठ है।', en:"It is better to do one's own duty imperfectly than another's duty perfectly." },
  ];
  let best = entries[Math.floor(Math.random()*entries.length)];
  for(const e of entries) {
    if(e.keys.some(k=>text.includes(k))) { best = e; break; }
  }
  return `---SLOKA---\n${best.s}\n---REFERENCE---\nBhagavad Gita - Chapter ${best.ch}, Verse ${best.v}\n---TRANSLITERATION---\n${best.tr}\n---HINDI---\n${best.hi}\n---ENGLISH---\n${best.en}\n---GUIDANCE---\nDear ${name}, Lord Krishna's eternal wisdom from the Bhagavad Gita speaks directly to your situation. This verse carries the answer you seek.\n\n${best.en}\n\nApply this wisdom to your life today. Take one step forward with faith and courage. The divine is always guiding you. 🙏`;
}

module.exports = { getGitaWisdom, loadVerses };
