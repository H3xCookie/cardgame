--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: friend; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.friend AS (
	id character varying(6),
	accepted boolean
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: card; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.card (
    c_id character varying(6) NOT NULL,
    c_black boolean DEFAULT false NOT NULL,
    c_text character varying(100) NOT NULL,
    c_owner_id character varying(6)
);


--
-- Name: deck; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck (
    d_id character varying(6) NOT NULL,
    d_name character varying(30) NOT NULL,
    d_cards_id character varying(6)[] NOT NULL,
    d_owner_id character varying(6),
    d_bookmarked_player character varying(6)[]
);


--
-- Name: friendship; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friendship (
    f_owner_id character varying(6) NOT NULL,
    friends_list public.friend[]
);


--
-- Name: player; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player (
    p_id character varying(6) NOT NULL,
    p_pwd character varying(100),
    p_username character varying(30) NOT NULL,
    p_email character varying(50),
    admin_acc boolean DEFAULT false NOT NULL,
    p_bookmarked_decks_id character varying(6)[]
);


--
-- Name: player_p_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_p_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: player_p_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_p_id_seq OWNED BY public.player.p_id;


--
-- Name: room; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room (
    r_state character varying(15) NOT NULL,
    r_max_players integer NOT NULL,
    r_owner_id character varying(6),
    r_joined_players character varying(6)[],
    r_id character varying(6)
);


--
-- Name: player p_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player ALTER COLUMN p_id SET DEFAULT nextval('public.player_p_id_seq'::regclass);


--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.card (c_id, c_black, c_text, c_owner_id) FROM stdin;
xdthr3	f	asdfasdf	uICRFS
i8pAbl	f	flkdsalfkjdsa\r\n	uICRFS
vY0B3i	f	asdfasdf	uICRFS
J0UaSC	t	fdsafdsakjfkldsjlkffdsafdsakjfkldsjlkffdsafdsakjfkldsjlkffdsafdsakjfkldsjlkffdsafdsakjfkldsjlkffdsaf	uICRFS
RzZvRb	t	el gamer	K0cGn6
ocZ5HN	t	el no gamer	K0cGn6
zZpg5Z	f	az sam mnogo goten	K0cGn6
tGhUh9	f	rewRERERERERE	K0cGn6
UkKoxm	f	petkan	9GGD7E
RRI4o4	f	petkan2	9GGD7E
kD3wwz	f	petkan3	9GGD7E
YVkOI1	f	petkan4	9GGD7E
tTWh1o	f	petkan 5	9GGD7E
drx3kO	f	Ben Shapiro	zPnAmv
1ZUlyw	f	Evgeni Minchev	zPnAmv
XsxO6p	f	Джо Байдън	nM9Lpf
i31Tvt	f	Мики маус	nM9Lpf
8S3dCC	f	Кирил	nM9Lpf
Rh47wN	f	Нещо	nM9Lpf
mPZoL2	f	Нещо друго	nM9Lpf
L4zJHb	f	скалата	nM9Lpf
C9s2ys	f	мишо майстора	nM9Lpf
S2lels	f	терминатор	nM9Lpf
cIrWCy	f	гошо	nM9Lpf
4NtoOE	f	гощко	nM9Lpf
ETZxq7	f	аз когато	nM9Lpf
LKRGq3	f	това е текст	nM9Lpf
qTaAPy	f	аз съм готен	nM9Lpf
Pg8K9N	f	картичка	nM9Lpf
P58etd	f	па па па	nM9Lpf
ZaiA3d	f	ГП	nM9Lpf
rQNmk6	f	баби с резачки	nM9Lpf
dmDLvj	f	Ы	nM9Lpf
X97Nn2	f	защо	nM9Lpf
7PPxYt	f	кирчо	nM9Lpf
n4G0Ux	f	ар	nM9Lpf
AbL3Li	f	алах	nM9Lpf
aXuaVz	f	плъх	nM9Lpf
BDGCOI	f	шише	nM9Lpf
V91WeU	t	кой е най големия	nM9Lpf
GqIceK	t	най-обичам	nM9Lpf
FxWKql	f	прахосмуцц	nM9Lpf
5zdXCE	f	кемал	nM9Lpf
2LfolW	f	тарантула	nM9Lpf
xhKFpG	f	мигрант	nM9Lpf
g2zAzv	f	ресто	nM9Lpf
J9Wzrn	t	мечтата ми е да срещна	nM9Lpf
2vLsOk	f	мимимимимми	nM9Lpf
L1MUpI	f	NUMBA 15	nM9Lpf
W21r9F	f	марулка	nM9Lpf
yCC3Yg	f	клошар	nM9Lpf
i6Onz1	f	венецуела	nM9Lpf
7Cq0bx	f	моцарела	nM9Lpf
Fnqk5n	f	Народна Република Северен Люлин	nM9Lpf
xheppf	t	Mnogo obicham da qm	pICAOJ
9Ca2BY	f	Hubavec	pICAOJ
jmNeyn	f	s	pICAOJ
zGVh3Y	t	tqlo	pICAOJ
KXb78D	t	Най-много обичам 	eER1nL
dBDJUq	t	WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW	q5xyvF
99nPYg	f	na	pICAOJ
gkJTad	f	09-ки	eER1nL
DQM9mG	t	boec	pICAOJ
ZBNo35	f	AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	q5xyvF
OomRpf	f	дебели жени	eER1nL
bueR66	f	грозно жени	eER1nL
hOsXIQ	t	колко пишки имам	nM9Lpf
Xhr1uA	f	негър по пишка	nM9Lpf
pbASkD	f	забавна карта	nM9Lpf
0BkKQA	f	Spas sexa	nM9Lpf
B7hyYD	f	negur69420420	nM9Lpf
FSGaFQ	f	MALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECAMALKI DECA	i1TY7s
A7FqGg	t	obicham da pravq seks s\r\n	i1TY7s
iGnxZv	t	delliska mirishe na	i1TY7s
uiGapW	f	smurt\r\n	i1TY7s
vC0RIl	f	tashaci\r\n	i1TY7s
SadllO	f	sopoli	i1TY7s
fuo3DP	f	koriandur	i1TY7s
4rl1Cs	f	sharena sol	i1TY7s
8LHO7f	f	kaliev permanganat\r\n	i1TY7s
vrWKlR	t	nai - liubimoto mi neshto sa	i1TY7s
85zUbi	f	metamfetamini\r\n	i1TY7s
7zlPcO	f	piko	i1TY7s
2ifwcE	f	krak	i1TY7s
Yl6m2S	f	ruka	i1TY7s
N0wrVg	f	dris	i1TY7s
bUYroy	f	piknq	i1TY7s
nzXI1Z	f	1000 topki na malki deca	i1TY7s
1eIIqZ	f	пишкозавър	nM9Lpf
6A20Uk	f	тръбан	nM9Lpf
TXt0jd	t	имам си	nM9Lpf
CC1mnZ	f	бесен арабин	nM9Lpf
Wt2d1H	f	debela jena	yrwUoI
rp91Hn	f	laino	yrwUoI
UXVkBr	f	govno	yrwUoI
I9TnXp	f	govnoto	yrwUoI
SHVy9N	f	grozni jeni	yrwUoI
lfvV5t	t	az sum ____	yrwUoI
iTpUWx	t	Obicham da qm ______	yrwUoI
yDrvgo	t	Maikati e _____	yrwUoI
3yBctE	t	Da budesh ili da ne budesh ______	yrwUoI
Lj5q55	f	pechka	yrwUoI
YihOYK	t	snaiperist	P9hFxF
moCCnT	t	babi sumisti	P9hFxF
TWkBoa	f	YES! ____ e naj-boroto.	yrwUoI
ShF2qN	f	ico hazarta	P9hFxF
lFwuUk	t	OH. YES! Come on _____!	yrwUoI
QgvMwx	f	selski kutek	P9hFxF
ZmF9Ke	t	 	WAgY4x
MXlNhN	f	dsada	BxFgcC
\.


--
-- Data for Name: deck; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deck (d_id, d_name, d_cards_id, d_owner_id, d_bookmarked_player) FROM stdin;
Ick3Mv	asdf	{xdthr3,i8pAbl,vY0B3i,J0UaSC}	uICRFS	\N
YM4KrK	някво	{XsxO6p,i31Tvt,8S3dCC,Rh47wN,L4zJHb,C9s2ys,S2lels,cIrWCy,4NtoOE,ETZxq7,LKRGq3,rQNmk6,7PPxYt,AbL3Li,aXuaVz,BDGCOI,V91WeU,GqIceK,FxWKql,5zdXCE,2LfolW,xhKFpG,g2zAzv,J9Wzrn,2vLsOk,L1MUpI,W21r9F,yCC3Yg,i6Onz1,7Cq0bx,Fnqk5n,hOsXIQ,Xhr1uA,pbASkD,0BkKQA,1eIIqZ,6A20Uk,TXt0jd}	nM9Lpf	\N
Ow6ig4	el decko whito	{XsxO6p,i31Tvt,8S3dCC,Rh47wN,mPZoL2,L4zJHb,C9s2ys,S2lels,cIrWCy,4NtoOE,ETZxq7,LKRGq3,qTaAPy,Pg8K9N,P58etd,ZaiA3d,rQNmk6,dmDLvj,X97Nn2,7PPxYt,n4G0Ux,AbL3Li,aXuaVz,BDGCOI,FxWKql,5zdXCE,2LfolW,xhKFpG,g2zAzv,2vLsOk,L1MUpI,W21r9F,yCC3Yg,i6Onz1,7Cq0bx,Fnqk5n}	nM9Lpf	{yrwUoI}
efyNAU	el decko negro	{V91WeU,GqIceK,J9Wzrn}	nM9Lpf	{}
dGEHX8	<h1>gayy</h1>	{ZmF9Ke}	WAgY4x	{}
QhqKVW	dizela	{Wt2d1H,rp91Hn,UXVkBr,I9TnXp,SHVy9N,lfvV5t,iTpUWx,yDrvgo,3yBctE}	yrwUoI	{}
ILubMx	kemal deck	{MXlNhN}	BxFgcC	{}
\.


--
-- Data for Name: friendship; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.friendship (f_owner_id, friends_list) FROM stdin;
7axVL5	{"(nM9Lpf,t)","(K0cGn6,t)"}
9GGD7E	{"(nM9Lpf,t)","(K0cGn6,t)"}
dsibuC	{"(nM9Lpf,t)","(K0cGn6,t)"}
K0cGn6	{"(nM9Lpf,t)","(7axVL5,t)","(9GGD7E,t)","(dsibuC,t)"}
zPnAmv	\N
BxFgcC	\N
eER1nL	\N
dzyW7G	\N
q5xyvF	\N
uIo7Ek	\N
iwbNrN	\N
rgZJEr	\N
i1TY7s	{"(nM9Lpf,t)","(pICAOJ,t)","(grc85U,t)"}
grc85U	{"(i1TY7s,t)"}
iral4I	\N
yrwUoI	\N
P9hFxF	\N
WAgY4x	\N
nM9Lpf	{"(dsibuC,t)","(7axVL5,t)","(K0cGn6,t)","(9GGD7E,t)","(i1TY7s,t)","(pICAOJ,t)"}
pICAOJ	{"(i1TY7s,t)","(nM9Lpf,t)"}
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.player (p_id, p_pwd, p_username, p_email, admin_acc, p_bookmarked_decks_id) FROM stdin;
K0cGn6	$2b$10$2Kx/PnHiDsstwNjVtrpE6eSF3Xb3iV09y6RSkzt.NmEEqPpLU.Lta	ivan2	ivan2@gmail.com	f	\N
7axVL5	$2b$10$iKOQ8zZlsB5q9LSi5gsxIuZL2c3gDPqs1FY3FiUES638DGGu2X3fq	ribar	ribar@com.gmail	f	\N
9GGD7E	$2b$10$Znk2MxcMghBjtZDKpUK.x.Z7kQjwvsLTb2AIR.y42iitL2sSySOxm	petkan	petkan@abv.bg	f	\N
zPnAmv	$2b$10$rzyhXQeCV.PdepeEhlYo7Oat4AMPiunlOwh7JfHGNFHxcSiSpOnBS	Anito	kjfdjfn@fdsd.com	f	\N
BxFgcC	$2b$10$p3fhThvPl5vTq4Jr7RU56OxrNXmPznUY14WAVNE8u6AmTw3NIUR7y	kemal	kemal@1.1	f	\N
pICAOJ	$2b$10$5w8eDNRWW8XSo5Z6jDSbeurSPqSG8CPrLESeN.9TVqbZwS4jjOrwW	pepo	peshokelesho@aes.vas	f	\N
eER1nL	$2b$10$Q1WmuE.fwE9wPx/Pjm0/4OuAZosHWO.HUTJXT56v09ZyEDvikuQOO	niki	niki@abv.bg	f	\N
q5xyvF	$2b$10$BfnQowGuVZBiTaeqFowFtObkdRTLbDLr53IQ5nNTxz7Lty9YNlRA2	WWWWWWwwww	xpucko@penisbog.bg	f	\N
uIo7Ek	$2b$10$auxo/TSrql9tqdyi7HTWRukI4hr1OwrCMAbgDx/4MCWsAKYKD.i02	telefon	te@le.fon	f	\N
iwbNrN	$2b$10$Zok9w8.qxePCsSpgwxBTBOUVae4iPi1zVbtg/eOgpgYdRArcgoDPm	brav	b@r.a	f	\N
rgZJEr	$2b$10$60MMd.dOyGnEZWBLqI7m6.mBSyyf632JAqm8XD7dFRptBqtL8IkPi	pitar pan	pi@ta.r	f	\N
yrwUoI	$2b$10$IOYvT652iEwlUmn0LNW4V.qeGWWIpOHZlFZx9BdH1sJr0HGocC/6S	dizela	dizela@gay.bg	f	{aLptyg,Ow6ig4}
i1TY7s	$2b$10$/4rOxpIZsoGt0Ce4d1GR.u4KheTfnQZECZK6ru30foD7jQQXekYgS	spas golqmata pishka	penis@wow.com	f	\N
grc85U	$2b$10$HDAH656ZmaB75WjaSY4Zzuig7FgB26/p8CpPlOjMmDeIf4JLxg7gm	🤑	penis@mail.com	f	\N
iral4I	$2b$10$UnAxP8FRlroZaG94Y3XtaOnGpU6NqRNkWqcSS4NhRBPih6BaQEZu2	test/test	test@test.test	f	\N
WAgY4x	$2b$10$HqKxSU5gRtwdneJSSLNnF.LESnQr6Ni8sTZx3ov0Rwk6t44lkudgW	  	gei@gei.gei	f	\N
dsibuC	$2b$10$Fbv89uRR4cSq.8LARQNvH.GAjC4Sab5GYQWLS4j01y5UCweFoA5YG	ivan	ivan@ivan.com	f	\N
nM9Lpf	$2b$10$LHxfsfNaEzU4s/0NEYF0S.HpXNknPrHRSw4RnmzqzCQlvEEQGDc4K	gamerman	gamer@man.com	t	{ucDVZU,zb4XlS,ucDVZU,90Oehi,ucDVZU,pVc97k,NxiKr3,rF4ySo,zb4XlS,MQR8am,30UdPP,r3N7EP,hlHqCa,boHn9u,f5KCnA,aLptyg}
P9hFxF	$2b$10$CDLBduWYDKR6Ju/W/5qjVO8vaG0CrNfvaMNfgnlWRnfQPwtyffWVK	xpucko	x@x	f	\N
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.room (r_state, r_max_players, r_owner_id, r_joined_players, r_id) FROM stdin;
\.


--
-- Name: player_p_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.player_p_id_seq', 15, true);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (c_id);


--
-- Name: deck deck_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_pkey PRIMARY KEY (d_id);


--
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (p_id);


--
-- PostgreSQL database dump complete
--

