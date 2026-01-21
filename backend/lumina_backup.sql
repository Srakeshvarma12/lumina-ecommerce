--
-- PostgreSQL database dump
--

\restrict jOlbLlxd8fpuVtCKEhrzeNlTyABFNJc8PXCQ4MNReTn7dcsepaWDymqbY3QIEgF

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: order_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_addresses (
    id integer NOT NULL,
    order_id integer,
    full_name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    address_line text NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    pincode character varying(10) NOT NULL,
    country character varying(50) DEFAULT 'India'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_addresses OWNER TO postgres;

--
-- Name: order_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_addresses_id_seq OWNER TO postgres;

--
-- Name: order_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_addresses_id_seq OWNED BY public.order_addresses.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total_amount numeric NOT NULL,
    status character varying(50) DEFAULT 'PLACED'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_id text,
    razorpay_order_id text,
    CONSTRAINT order_status_check CHECK (((status)::text = ANY ((ARRAY['CREATED'::character varying, 'PLACED'::character varying, 'PAID'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    razorpay_order_id character varying(255) NOT NULL,
    razorpay_payment_id character varying(255) NOT NULL,
    razorpay_signature text,
    status character varying(50) DEFAULT 'success'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    refund_id text,
    refund_status character varying(50)
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text,
    category text,
    is_featured boolean DEFAULT false
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: refunds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refunds (
    id integer NOT NULL,
    order_id integer,
    razorpay_payment_id character varying(255) NOT NULL,
    razorpay_refund_id character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'processed'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refunds OWNER TO postgres;

--
-- Name: refunds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refunds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refunds_id_seq OWNER TO postgres;

--
-- Name: refunds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refunds_id_seq OWNED BY public.refunds.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlists_id_seq OWNER TO postgres;

--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: order_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses ALTER COLUMN id SET DEFAULT nextval('public.order_addresses_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: refunds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds ALTER COLUMN id SET DEFAULT nextval('public.refunds_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, product_id, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, product_id, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: order_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_addresses (id, order_id, full_name, phone, address_line, city, state, pincode, country, created_at) FROM stdin;
1	107	rafsss	9876543210	naesxcsvbnxma	neodixj	skxsuyghxs	546372	India	2026-01-19 00:42:07.305755
2	108	raaaaaaa	9874562130	poiyt	sxzcffv	hhyyytyt	558878	India	2026-01-19 00:48:33.070255
3	109	rrrr	9996325896	lkjuytafv	 mdnfhv	nxhcvfdrew	541152	India	2026-01-19 12:17:07.578413
4	110	RAKESH	7894561230	delhi	usa	newyork	459762	India	2026-01-19 13:09:24.728958
5	111	smv	9999999999	ameee	arling	tex	645987	India	2026-01-19 14:53:44.477015
6	112	srv	7895641215	neeee	hyd	AP	578945	India	2026-01-19 16:37:14.964079
7	113	rakesh	7894561230	HSR	BLR	KA	567452	India	2026-01-19 18:53:28.442187
8	114	here	77777777777	yrdcvsbnmd	dmjx	mmsjuyx	458756	India	2026-01-19 18:56:20.346232
9	115	rakesh	7896541230	aawsdr	nwy	ap	457896	India	2026-01-19 19:38:46.840938
10	116	assssssssaaaaa	7789954561	ssrsss	bar4serxd	atsrdsc	547896	India	2026-01-19 20:00:54.557464
11	117	raaaaaaaaa	dsssssss	sssssssss	sssssss	aaaaaaaaaa	111112	India	2026-01-19 20:06:47.550511
12	118	RAke	9874563210	ind	usa	uk	112233	India	2026-01-19 20:19:15.276079
13	119	rv	78966513112	jheezrezze	tvtyty	ctyi	678678	India	2026-01-19 20:24:38.004857
14	120	rakesh	9999988789	nellorre	hyd	ap	541236	India	2026-01-19 20:46:54.79456
15	121	raaa	7896544102	susyshx	shshxeedr	cnndxwrtyuijb	456987	India	2026-01-19 21:29:31.267243
16	122	SRV	7788994455	NELLORE	HYD	AP	556622	India	2026-01-19 21:35:23.862786
17	123	suma	9874561230	kodur	KDR	AP	521003	India	2026-01-20 00:48:08.170668
18	124	spr	7777243546	NLR	NELLORE	AP	524400	India	2026-01-20 01:02:57.040616
19	125	rakesh	7889945612	nlr	blr	ka	456123	India	2026-01-20 01:32:39.196618
20	126	mahe	8899774455	UTA	DALLAS	TEXAS	456698	India	2026-01-20 22:15:03.213748
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
47	46	325	1	5.99
48	47	326	1	9.99
49	48	325	1	5.99
50	49	633	1	799.99
51	50	637	1	19.99
52	51	638	1	22.99
53	52	637	1	19.99
54	53	637	1	19.99
55	54	630	1	2499.99
56	54	636	1	34.99
57	54	632	1	499.99
58	54	638	4	22.99
59	54	637	5	19.99
60	55	637	1	19.99
61	56	638	1	22.99
62	57	637	1	19.99
63	58	637	1	19.99
64	59	637	1	19.99
65	60	637	1	19.99
66	61	637	1	19.99
67	62	592	1	9.99
68	62	637	1	19.99
69	63	631	1	299.99
70	64	637	1	19.99
71	65	638	1	22.99
72	65	637	1	19.99
73	66	638	1	22.99
74	67	638	1	22.99
75	68	635	1	24.99
76	69	638	1	22.99
77	70	638	2	22.99
78	71	638	1	22.99
79	72	635	1	24.99
80	73	634	1	29.99
81	74	638	1	22.99
82	75	629	1	1899.99
83	76	637	1	19.99
84	77	634	1	29.99
85	78	638	1	22.99
86	79	638	1	22.99
87	80	638	2	22.99
88	81	633	1	799.99
89	82	637	1	19.99
90	83	637	1	19.99
91	84	638	1	22.99
92	85	638	1	22.99
93	86	634	1	29.99
94	87	638	1	22.99
95	88	638	1	22.99
96	89	638	1	22.99
97	90	638	1	22.99
98	91	638	1	22.99
99	92	638	1	22.99
100	93	638	1	22.99
101	94	636	1	34.99
102	94	638	1	22.99
103	95	637	1	19.99
104	96	638	1	22.99
105	97	586	1	13999.99
106	98	638	1	22.99
107	99	585	1	10999.99
108	99	638	1	22.99
109	100	631	1	299.99
110	101	624	1	59.99
111	102	638	1	22.99
112	103	585	1	10999.99
113	103	584	1	12999.99
114	104	637	1	19.99
115	105	636	1	34.99
116	106	638	1	22.99
117	107	637	2	19.99
118	108	617	1	19.99
119	109	637	1	19.99
120	110	634	1	29.99
121	111	638	1	22.99
122	112	638	1	22.99
123	113	633	1	799.99
124	114	625	1	29.99
125	115	634	1	29.99
126	116	634	1	29.99
127	117	613	1	3.49
128	118	630	1	2499.99
129	119	576	1	4999.99
130	120	619	1	5.99
131	121	632	1	499.99
132	122	630	1	2499.99
133	122	628	1	49.99
134	123	626	1	39.99
135	123	637	1	19.99
136	124	628	1	49.99
137	124	620	1	1.99
138	125	620	1	1.99
139	126	637	1	19.99
140	126	636	1	34.99
141	126	621	1	3.99
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, created_at, payment_id, razorpay_order_id) FROM stdin;
105	1	34.99	REFUNDED	2026-01-18 22:50:14.373196	pay_S5QD77XMGxzvxo	order_S5QCq8gPVjAHo6
46	1	5.99	PAID	2026-01-14 20:08:54.5426	pay_S3nKOOxgy0GsSr	order_S3nK1xQ6z0SFJL
118	1	2499.99	PAID	2026-01-19 20:19:15.276079	pay_S5mAfxWlIgqerW	order_S5mASpK2sYIL3i
47	1	9.99	PAID	2026-01-14 23:55:20.185637	pay_S3rBcMOJvfvFKr	order_S3rBDtWxdC9te4
48	1	5.99	PLACED	2026-01-15 17:40:08.24422	\N	\N
49	1	799.99	PAID	2026-01-15 23:07:13.512968	pay_S4EtrY0IopQjWv	order_S4EtWbhtGFCHiz
106	1	22.99	REFUNDED	2026-01-18 23:51:24.841971	pay_S5RFk7PF1iA7km	order_S5RFTJIIX7w4vU
107	1	39.98	PAID	2026-01-19 00:42:07.305755	pay_S5S7JXcynR5hJ5	order_S5S72YXTNNl2CH
50	1	19.99	PAID	2026-01-16 11:28:25.723486	pay_S4RaIBvPJNgjFy	order_S4RZtpWn8PsjU2
51	1	22.99	PLACED	2026-01-16 16:36:20.652824	\N	\N
52	1	19.99	PLACED	2026-01-16 17:46:10.782015	\N	\N
53	1	19.99	PAID	2026-01-16 18:03:37.027516	pay_S4alppyuiPtWLw	order_S4alYPVLmFXREI
54	1	3226.88	PLACED	2026-01-16 20:30:46.73585	\N	order_S4amViF5ty8OAE
55	1	19.99	PLACED	2026-01-16 22:42:01.216293	\N	\N
56	1	22.99	PLACED	2026-01-16 22:42:42.975634	\N	\N
57	1	19.99	PLACED	2026-01-16 22:43:11.317849	\N	\N
58	1	19.99	PLACED	2026-01-16 22:43:36.531886	\N	\N
108	1	19.99	PAID	2026-01-19 00:48:33.070255	pay_S5SE0tixzhx0c1	order_S5SDoNd6Uy6vBy
59	1	19.99	PLACED	2026-01-16 22:46:15.859138	\N	\N
60	1	19.99	PLACED	2026-01-16 22:47:08.930033	\N	\N
119	1	4999.99	PAID	2026-01-19 20:24:38.004857	pay_S5mGL73VPdgA17	order_S5mG94wUYcJik9
109	1	19.99	PAID	2026-01-19 12:17:07.578413	pay_S5dxWCyGmWonMj	order_S5dxBW0fuSqG9e
120	1	5.99	PLACED	2026-01-19 20:46:54.79456	\N	\N
110	1	29.99	PAID	2026-01-19 13:09:24.728958	pay_S5eqkHZpcmdjyM	order_S5eqQ2iy3HVlBm
61	1	19.99	PLACED	2026-01-16 22:50:00.899952	\N	\N
62	1	29.98	PLACED	2026-01-16 23:47:00.307552	\N	\N
125	1	1.99	PAID	2026-01-20 01:32:39.196618	pay_S5rVeZGn5zEJyf	order_S5rVXqZ0b68HmW
64	1	19.99	PAID	2026-01-17 00:05:44.527201	pay_S4g8KB8r6aLbEV	order_S4g848mmdElqcb
111	1	22.99	REFUNDED	2026-01-19 14:53:44.477015	pay_S5gcnz4BWwgx23	order_S5gcdEpu4v1csi
63	1	299.99	PLACED	2026-01-16 23:55:26.150908	\N	order_S4g8gOOHzAjRV9
65	1	42.98	PLACED	2026-01-17 01:59:32.17326	\N	\N
66	1	22.99	PLACED	2026-01-17 12:32:35.105482	\N	\N
67	1	22.99	PLACED	2026-01-17 12:33:49.903358	\N	\N
68	1	24.99	PLACED	2026-01-17 12:38:29.021337	\N	\N
69	1	22.99	PLACED	2026-01-17 12:45:37.75046	\N	\N
70	1	45.98	PLACED	2026-01-17 12:57:00.334946	\N	\N
71	1	22.99	PLACED	2026-01-17 13:03:56.875485	\N	\N
72	1	24.99	PLACED	2026-01-17 21:34:20.278171	\N	\N
73	1	29.99	PLACED	2026-01-17 21:37:13.850259	\N	\N
74	1	22.99	PLACED	2026-01-17 22:13:56.606489	\N	\N
75	1	1899.99	PLACED	2026-01-17 22:24:24.637265	\N	\N
76	1	19.99	PLACED	2026-01-17 22:25:05.275402	\N	\N
77	1	29.99	PLACED	2026-01-17 22:35:16.284085	\N	\N
78	1	22.99	PLACED	2026-01-17 22:35:49.604978	\N	\N
79	1	22.99	PLACED	2026-01-17 22:39:12.348895	\N	\N
80	1	45.98	PLACED	2026-01-17 22:42:06.501112	\N	\N
81	1	799.99	PLACED	2026-01-17 22:47:14.07247	\N	\N
82	1	19.99	PLACED	2026-01-17 22:49:04.231009	\N	\N
83	1	19.99	PLACED	2026-01-17 22:54:35.928685	\N	\N
84	1	22.99	PLACED	2026-01-17 22:59:52.380908	\N	\N
85	1	22.99	PLACED	2026-01-17 23:04:41.628632	\N	\N
86	1	29.99	PLACED	2026-01-17 23:18:54.074857	\N	\N
87	1	22.99	PLACED	2026-01-17 23:19:53.570848	\N	\N
88	1	22.99	PLACED	2026-01-17 23:21:33.190501	\N	\N
89	1	22.99	PLACED	2026-01-17 23:22:12.062669	\N	\N
90	1	22.99	PLACED	2026-01-17 23:35:34.292662	\N	\N
91	1	22.99	PLACED	2026-01-17 23:55:43.747032	\N	\N
92	1	22.99	PLACED	2026-01-17 23:59:42.855999	\N	\N
93	1	22.99	PLACED	2026-01-18 00:05:12.822321	\N	\N
94	1	57.98	PLACED	2026-01-18 00:15:47.707864	\N	\N
95	1	19.99	PLACED	2026-01-18 11:43:53.449871	\N	\N
96	1	22.99	PLACED	2026-01-18 11:50:56.025195	\N	\N
97	1	13999.99	PLACED	2026-01-18 12:12:55.703412	\N	\N
98	1	22.99	PLACED	2026-01-18 14:32:46.930534	\N	\N
99	1	11022.98	PLACED	2026-01-18 19:21:11.34714	\N	\N
100	1	299.99	PLACED	2026-01-18 19:37:21.165058	\N	order_S5Mv8911mMEcFz
101	1	59.99	PLACED	2026-01-18 19:47:35.176117	\N	order_S5N5tGnyxFN6UX
112	2	22.99	PAID	2026-01-19 16:37:14.964079	pay_S5iOHh2vi6LXwA	order_S5iNxrclcUYjiw
102	1	22.99	PAID	2026-01-18 19:59:39.53141	pay_S5NIiqM1iFVvtJ	order_S5NIe2WJNDnQP0
113	1	799.99	PLACED	2026-01-19 18:53:28.442187	\N	\N
103	1	23999.98	PAID	2026-01-18 20:01:11.27027	pay_S5NKNtd9iuC1qs	order_S5NKFy8czuBzQy
114	1	29.99	PLACED	2026-01-19 18:56:20.346232	\N	\N
104	1	19.99	PAID	2026-01-18 22:37:22.167278	pay_S5PzU3qjO3HjAb	order_S5PzG7ENUu6E9G
121	1	499.99	PAID	2026-01-19 21:29:31.267243	pay_S5nMwVG5tbLcyM	order_S5nMiENpRJ4Lnc
115	1	29.99	PAID	2026-01-19 19:38:46.840938	pay_S5lUASPCAErKne	order_S5lTjkrTOGWDBz
116	1	29.99	PLACED	2026-01-19 20:00:54.557464	\N	order_S5lr5NrOPG0csc
122	3	2549.98	PAID	2026-01-19 21:35:23.862786	pay_S5nT6xPwbOz5EO	order_S5nStrZZjnZw07
117	1	3.49	PAID	2026-01-19 20:06:47.550511	pay_S5lxUTkMkA9x9D	order_S5lxIb4PFMjYbn
126	1	58.970000000000006	PAID	2026-01-20 22:15:03.213748	pay_S6CgJ7U2PbbOhg	order_S6Cfx9xvoC1QQP
123	3	59.98	PAID	2026-01-20 00:48:08.170668	pay_S5qkhKTsvMknUD	order_S5qkWBiPHmfZbw
124	3	51.98	PAID	2026-01-20 01:02:57.040616	pay_S5r0I1pNEZmOK9	order_S5r09cJmjSizJT
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, status, created_at, refund_id, refund_status) FROM stdin;
38	46	order_S3nK1xQ6z0SFJL	pay_S3nKOOxgy0GsSr	\N	success	2026-01-14 20:09:22.06653	\N	\N
39	47	order_S3rBDtWxdC9te4	pay_S3rBcMOJvfvFKr	\N	success	2026-01-14 23:55:49.811414	\N	\N
40	49	order_S4EtWbhtGFCHiz	pay_S4EtrY0IopQjWv	\N	success	2026-01-15 23:07:41.15897	\N	\N
41	50	order_S4RZtpWn8PsjU2	pay_S4RaIBvPJNgjFy	\N	success	2026-01-16 11:32:11.405767	\N	\N
42	53	order_S4alYPVLmFXREI	pay_S4alppyuiPtWLw	\N	success	2026-01-16 20:31:19.610936	\N	\N
43	64	order_S4g848mmdElqcb	pay_S4g8KB8r6aLbEV	\N	success	2026-01-17 01:46:05.124181	\N	\N
44	102	order_S5NIe2WJNDnQP0	pay_S5NIiqM1iFVvtJ	\N	success	2026-01-18 19:59:46.581763	\N	\N
45	103	order_S5NKFy8czuBzQy	pay_S5NKNtd9iuC1qs	\N	success	2026-01-18 20:01:20.900001	\N	\N
46	104	order_S5PzG7ENUu6E9G	pay_S5PzU3qjO3HjAb	\N	success	2026-01-18 22:37:38.739333	\N	\N
47	105	order_S5QCq8gPVjAHo6	pay_S5QD77XMGxzvxo	\N	success	2026-01-18 22:50:32.137608	\N	\N
48	106	order_S5RFTJIIX7w4vU	pay_S5RFk7PF1iA7km	\N	success	2026-01-18 23:51:43.697846	\N	\N
49	107	order_S5S72YXTNNl2CH	pay_S5S7JXcynR5hJ5	\N	success	2026-01-19 00:42:25.935874	\N	\N
50	108	order_S5SDoNd6Uy6vBy	pay_S5SE0tixzhx0c1	\N	success	2026-01-19 00:48:46.823968	\N	\N
51	109	order_S5dxBW0fuSqG9e	pay_S5dxWCyGmWonMj	\N	success	2026-01-19 12:17:29.449097	\N	\N
52	110	order_S5eqQ2iy3HVlBm	pay_S5eqkHZpcmdjyM	\N	success	2026-01-19 13:09:46.938757	\N	\N
53	111	order_S5gcdEpu4v1csi	pay_S5gcnz4BWwgx23	\N	success	2026-01-19 14:53:57.42488	\N	\N
54	112	order_S5iNxrclcUYjiw	pay_S5iOHh2vi6LXwA	\N	success	2026-01-19 16:37:36.028757	\N	\N
55	115	order_S5lTjkrTOGWDBz	pay_S5lUASPCAErKne	\N	success	2026-01-19 19:39:15.405534	\N	\N
56	117	order_S5lxIb4PFMjYbn	pay_S5lxUTkMkA9x9D	\N	success	2026-01-19 20:07:00.990733	\N	\N
57	118	order_S5mASpK2sYIL3i	pay_S5mAfxWlIgqerW	\N	success	2026-01-19 20:19:29.24595	\N	\N
58	119	order_S5mG94wUYcJik9	pay_S5mGL73VPdgA17	\N	success	2026-01-19 20:24:50.998465	\N	\N
59	121	order_S5nMiENpRJ4Lnc	pay_S5nMwVG5tbLcyM	\N	success	2026-01-19 21:29:47.703749	\N	\N
60	122	order_S5nStrZZjnZw07	pay_S5nT6xPwbOz5EO	\N	success	2026-01-19 21:35:38.283902	\N	\N
61	123	order_S5qkWBiPHmfZbw	pay_S5qkhKTsvMknUD	\N	success	2026-01-20 00:48:21.728859	\N	\N
62	124	order_S5r09cJmjSizJT	pay_S5r0I1pNEZmOK9	\N	success	2026-01-20 01:03:08.51285	\N	\N
63	125	order_S5rVXqZ0b68HmW	pay_S5rVeZGn5zEJyf	\N	success	2026-01-20 01:32:48.957396	\N	\N
64	126	order_S6Cfx9xvoC1QQP	pay_S6CgJ7U2PbbOhg	\N	success	2026-01-20 22:15:26.563022	\N	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, created_by, created_at, image_url, category, is_featured) FROM stdin;
585	Rolex Datejust	The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.	10999.99	53	\N	2026-01-15 22:01:06.983698	https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp	mens-watches	f
584	Rolex Cellini Moonphase	The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex's commitment to precision and elegance.	12999.99	70	\N	2026-01-15 22:01:06.983102	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp	mens-watches	f
279	Powder Canister	The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.	14.99	15	\N	2026-01-14 16:37:27.489982	https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp	general	f
282	Calvin Klein CK One	CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.	49.99	42	\N	2026-01-14 16:37:27.490997	https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp	general	f
287	Annibale Colombo Bed	The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.	1899.99	46	\N	2026-01-14 16:37:27.493825	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp	general	f
617	Protein Powder	Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.	19.99	75	\N	2026-01-15 22:01:07.818363	https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp	groceries	f
304	Ice Cream	Creamy and delicious ice cream, available in various flavors for a delightful treat.	5.49	14	\N	2026-01-14 16:37:27.50156	https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp	general	f
305	Juice	Refreshing fruit juice, packed with vitamins and great for staying hydrated.	3.99	31	\N	2026-01-14 16:37:27.502473	https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp	general	f
306	Kiwi	Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.	2.49	44	\N	2026-01-14 16:37:27.503297	https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp	general	f
300	Fish Steak	Quality fish steak, suitable for grilling, baking, or pan-searing.	14.99	49	\N	2026-01-14 16:37:27.5007	https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp	general	f
628	Table Lamp	The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.	49.99	58	\N	2026-01-15 22:01:08.366403	https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp	home-decoration	f
288	Annibale Colombo Sofa	The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.	2499.99	46	\N	2026-01-14 16:37:27.494394	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp	general	f
289	Bedside Table African Cherry	The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.	299.99	42	\N	2026-01-14 16:37:27.495095	https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp	general	f
290	Knoll Saarinen Executive Conference Chair	The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.	499.99	14	\N	2026-01-14 16:37:27.495927	https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp	general	f
291	Wooden Bathroom Sink With Mirror	The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.	799.99	18	\N	2026-01-14 16:37:27.496765	https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp	general	f
292	Apple	Fresh and crisp apples, perfect for snacking or incorporating into various recipes.	1.99	45	\N	2026-01-14 16:37:27.497383	https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp	general	f
293	Beef Steak	High-quality beef steak, great for grilling or cooking to your preferred level of doneness.	12.99	47	\N	2026-01-14 16:37:27.498067	https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp	general	f
294	Cat Food	Nutritious cat food formulated to meet the dietary needs of your feline friend.	8.99	31	\N	2026-01-14 16:37:27.498812	https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp	groceries	f
295	Chicken Meat	Fresh and tender chicken meat, suitable for various culinary preparations.	9.99	24	\N	2026-01-14 16:37:27.499091	https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp	groceries	f
297	Cucumber	Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.	1.49	27	\N	2026-01-14 16:37:27.49965	https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp	general	f
298	Dog Food	Specially formulated dog food designed to provide essential nutrients for your canine companion.	10.99	43	\N	2026-01-14 16:37:27.499894	https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp	groceries	f
299	Eggs	Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.	2.99	11	\N	2026-01-14 16:37:27.500382	https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp	general	f
627	Plant Pot	The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.	14.99	73	\N	2026-01-15 22:01:08.365704	https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp	home-decoration	f
301	Green Bell Pepper	Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.	1.29	16	\N	2026-01-14 16:37:27.500936	https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp	general	f
302	Green Chili Pepper	Spicy green chili pepper, ideal for adding heat to your favorite recipes.	0.99	35	\N	2026-01-14 16:37:27.50116	https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp	general	f
303	Honey Jar	Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.	6.99	39	\N	2026-01-14 16:37:27.501362	https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp	general	f
283	Chanel Coco Noir Eau De	Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.	129.99	15	\N	2026-01-14 16:37:27.491299	https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp	fragrances	f
284	Dior J'adore	J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.	89.99	31	\N	2026-01-14 16:37:27.491611	https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp	fragrances	f
285	Dolce Shine Eau de	Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.	69.99	36	\N	2026-01-14 16:37:27.492185	https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp	fragrances	f
286	Gucci Bloom Eau de	Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.	79.99	24	\N	2026-01-14 16:37:27.492971	https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp	fragrances	f
296	Cooking Oil	Versatile cooking oil suitable for frying, sautéing, and various culinary applications.	4.99	36	\N	2026-01-14 16:37:27.499342	https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp	groceries	f
307	Lemon	Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.	0.79	47	\N	2026-01-14 16:37:27.503961	https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp	general	f
309	Mulberry	Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.	4.99	19	\N	2026-01-14 16:37:27.505129	https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp	general	f
311	Potatoes	Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.	2.29	34	\N	2026-01-14 16:37:27.506435	https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp	general	f
312	Protein Powder	Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.	19.99	24	\N	2026-01-14 16:37:27.506965	https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp	general	f
313	Red Onions	Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.	1.99	11	\N	2026-01-14 16:37:27.507477	https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp	general	f
315	Soft Drinks	Assorted soft drinks in various flavors, perfect for refreshing beverages.	1.99	35	\N	2026-01-14 16:37:27.508805	https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp	general	f
316	Strawberry	Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.	3.99	31	\N	2026-01-14 16:37:27.509018	https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp	general	f
317	Tissue Paper Box	Convenient tissue paper box for everyday use, providing soft and absorbent tissues.	2.49	35	\N	2026-01-14 16:37:27.509213	https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp	general	f
318	Water	Pure and refreshing bottled water, essential for staying hydrated throughout the day.	0.99	14	\N	2026-01-14 16:37:27.509408	https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp	general	f
319	Decoration Swing	The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.	59.99	30	\N	2026-01-14 16:37:27.509601	https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp	general	f
320	Family Tree Photo Frame	The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.	29.99	43	\N	2026-01-14 16:37:27.509801	https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp	general	f
321	House Showpiece Plant	The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.	39.99	42	\N	2026-01-14 16:37:27.509995	https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp	general	f
322	Plant Pot	The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.	14.99	20	\N	2026-01-14 16:37:27.510228	https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp	general	f
323	Table Lamp	The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.	49.99	24	\N	2026-01-14 16:37:27.510421	https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp	general	f
324	Bamboo Spatula	The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.	7.99	18	\N	2026-01-14 16:37:27.510615	https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp	general	f
277	Essence Mascara Lash Princess	The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.	9.99	32	\N	2026-01-14 16:37:27.487231	https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp	beauty	f
278	Eyeshadow Palette with Mirror	The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.	19.99	47	\N	2026-01-14 16:37:27.489295	https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp	beauty	f
280	Red Lipstick	The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.	12.99	27	\N	2026-01-14 16:37:27.49035	https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp	beauty	f
281	Red Nail Polish	The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.	8.99	32	\N	2026-01-14 16:37:27.490682	https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp	beauty	f
308	Milk	Fresh and nutritious milk, a staple for various recipes and daily consumption.	3.49	17	\N	2026-01-14 16:37:27.504569	https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp	groceries	f
325	Black Aluminium Cup	The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.	5.99	28	\N	2026-01-14 16:37:27.510847	https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp	general	f
326	Black Whisk	The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.	9.99	30	\N	2026-01-14 16:37:27.511058	https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp	general	f
310	Nescafe Coffee	Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.	7.99	44	\N	2026-01-14 16:37:27.505882	https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp	groceries	f
314	Rice	High-quality rice, a staple for various cuisines and a versatile base for many dishes.	5.99	15	\N	2026-01-14 16:37:27.508205	https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp	groceries	f
327	Essence Mascara Lash Princess	The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.	9.99	41	\N	2026-01-15 21:08:26.109559	https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp	general	f
328	Eyeshadow Palette with Mirror	The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.	19.99	45	\N	2026-01-15 21:08:26.127313	https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp	general	f
329	Powder Canister	The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.	14.99	25	\N	2026-01-15 21:08:26.12827	https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp	general	f
330	Red Lipstick	The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.	12.99	48	\N	2026-01-15 21:08:26.12905	https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp	general	f
331	Red Nail Polish	The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.	8.99	36	\N	2026-01-15 21:08:26.129775	https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp	general	f
332	Calvin Klein CK One	CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.	49.99	20	\N	2026-01-15 21:08:26.130549	https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp	general	f
333	Chanel Coco Noir Eau De	Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.	129.99	32	\N	2026-01-15 21:08:26.13146	https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp	general	f
334	Dior J'adore	J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.	89.99	21	\N	2026-01-15 21:08:26.132571	https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp	general	f
335	Dolce Shine Eau de	Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.	69.99	42	\N	2026-01-15 21:08:26.133552	https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp	general	f
336	Gucci Bloom Eau de	Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.	79.99	25	\N	2026-01-15 21:08:26.135016	https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp	general	f
337	Annibale Colombo Bed	The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.	1899.99	48	\N	2026-01-15 21:08:26.135902	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp	general	f
338	Annibale Colombo Sofa	The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.	2499.99	45	\N	2026-01-15 21:08:26.137236	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp	general	f
339	Bedside Table African Cherry	The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.	299.99	46	\N	2026-01-15 21:08:26.138097	https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp	general	f
340	Knoll Saarinen Executive Conference Chair	The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.	499.99	48	\N	2026-01-15 21:08:26.138944	https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp	general	f
341	Wooden Bathroom Sink With Mirror	The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.	799.99	13	\N	2026-01-15 21:08:26.140251	https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp	general	f
342	Apple	Fresh and crisp apples, perfect for snacking or incorporating into various recipes.	1.99	41	\N	2026-01-15 21:08:26.141436	https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp	general	f
343	Beef Steak	High-quality beef steak, great for grilling or cooking to your preferred level of doneness.	12.99	13	\N	2026-01-15 21:08:26.142287	https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp	general	f
344	Cat Food	Nutritious cat food formulated to meet the dietary needs of your feline friend.	8.99	25	\N	2026-01-15 21:08:26.143156	https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp	groceries	f
345	Chicken Meat	Fresh and tender chicken meat, suitable for various culinary preparations.	9.99	26	\N	2026-01-15 21:08:26.143862	https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp	groceries	f
346	Cooking Oil	Versatile cooking oil suitable for frying, sautéing, and various culinary applications.	4.99	35	\N	2026-01-15 21:08:26.144533	https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp	general	f
347	Cucumber	Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.	1.49	20	\N	2026-01-15 21:08:26.145405	https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp	general	f
348	Dog Food	Specially formulated dog food designed to provide essential nutrients for your canine companion.	10.99	36	\N	2026-01-15 21:08:26.146071	https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp	groceries	f
349	Eggs	Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.	2.99	27	\N	2026-01-15 21:08:26.146765	https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp	general	f
350	Fish Steak	Quality fish steak, suitable for grilling, baking, or pan-searing.	14.99	43	\N	2026-01-15 21:08:26.147427	https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp	general	f
351	Green Bell Pepper	Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.	1.29	29	\N	2026-01-15 21:08:26.148126	https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp	general	f
352	Green Chili Pepper	Spicy green chili pepper, ideal for adding heat to your favorite recipes.	0.99	26	\N	2026-01-15 21:08:26.148793	https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp	general	f
353	Honey Jar	Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.	6.99	24	\N	2026-01-15 21:08:26.150927	https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp	general	f
354	Ice Cream	Creamy and delicious ice cream, available in various flavors for a delightful treat.	5.49	19	\N	2026-01-15 21:08:26.151608	https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp	general	f
355	Juice	Refreshing fruit juice, packed with vitamins and great for staying hydrated.	3.99	41	\N	2026-01-15 21:08:26.152306	https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp	general	f
356	Kiwi	Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.	2.49	19	\N	2026-01-15 21:08:26.152893	https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp	general	f
357	Lemon	Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.	0.79	37	\N	2026-01-15 21:08:26.154012	https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp	general	f
358	Milk	Fresh and nutritious milk, a staple for various recipes and daily consumption.	3.49	40	\N	2026-01-15 21:08:26.154673	https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp	general	f
359	Mulberry	Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.	4.99	22	\N	2026-01-15 21:08:26.155451	https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp	general	f
360	Nescafe Coffee	Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.	7.99	38	\N	2026-01-15 21:08:26.156637	https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp	general	f
361	Potatoes	Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.	2.29	27	\N	2026-01-15 21:08:26.158383	https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp	general	f
362	Protein Powder	Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.	19.99	12	\N	2026-01-15 21:08:26.15917	https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp	general	f
363	Red Onions	Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.	1.99	10	\N	2026-01-15 21:08:26.159965	https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp	general	f
364	Rice	High-quality rice, a staple for various cuisines and a versatile base for many dishes.	5.99	36	\N	2026-01-15 21:08:26.160737	https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp	general	f
365	Soft Drinks	Assorted soft drinks in various flavors, perfect for refreshing beverages.	1.99	37	\N	2026-01-15 21:08:26.161527	https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp	general	f
366	Strawberry	Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.	3.99	35	\N	2026-01-15 21:08:26.162759	https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp	general	f
367	Tissue Paper Box	Convenient tissue paper box for everyday use, providing soft and absorbent tissues.	2.49	47	\N	2026-01-15 21:08:26.163575	https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp	general	f
368	Water	Pure and refreshing bottled water, essential for staying hydrated throughout the day.	0.99	21	\N	2026-01-15 21:08:26.164356	https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp	general	f
369	Decoration Swing	The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.	59.99	19	\N	2026-01-15 21:08:26.16514	https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp	general	f
370	Family Tree Photo Frame	The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.	29.99	21	\N	2026-01-15 21:08:26.165938	https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp	general	f
371	House Showpiece Plant	The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.	39.99	43	\N	2026-01-15 21:08:26.166578	https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp	general	f
372	Plant Pot	The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.	14.99	15	\N	2026-01-15 21:08:26.167378	https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp	general	f
373	Table Lamp	The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.	49.99	40	\N	2026-01-15 21:08:26.168144	https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp	general	f
374	Bamboo Spatula	The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.	7.99	19	\N	2026-01-15 21:08:26.168927	https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp	general	f
375	Black Aluminium Cup	The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.	5.99	12	\N	2026-01-15 21:08:26.169721	https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp	general	f
376	Black Whisk	The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.	9.99	36	\N	2026-01-15 21:08:26.170491	https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp	general	f
377	iPhone 5s	The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.	199.99	43	\N	2026-01-15 21:53:49.50728	https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp	smartphones	f
378	iPhone 6	The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.	299.99	39	\N	2026-01-15 21:53:49.511305	https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp	smartphones	f
379	iPhone 13 Pro	The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.	1099.99	57	\N	2026-01-15 21:53:49.512518	https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp	smartphones	f
380	iPhone X	The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.	899.99	56	\N	2026-01-15 21:53:49.513177	https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp	smartphones	f
381	Oppo A57	The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.	249.99	57	\N	2026-01-15 21:53:49.514651	https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp	smartphones	f
382	Oppo F19 Pro Plus	The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.	399.99	22	\N	2026-01-15 21:53:49.515304	https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp	smartphones	f
383	Oppo K1	The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.	299.99	62	\N	2026-01-15 21:53:49.515882	https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp	smartphones	f
384	Realme C35	The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.	149.99	75	\N	2026-01-15 21:53:49.516486	https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp	smartphones	f
385	Realme X	The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.	299.99	21	\N	2026-01-15 21:53:49.517218	https://cdn.dummyjson.com/product-images/smartphones/realme-x/thumbnail.webp	smartphones	f
386	Realme XT	The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.	349.99	28	\N	2026-01-15 21:53:49.517918	https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp	smartphones	f
387	Samsung Galaxy S7	The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.	299.99	69	\N	2026-01-15 21:53:49.518531	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp	smartphones	f
388	Samsung Galaxy S8	The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.	499.99	67	\N	2026-01-15 21:53:49.519277	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp	smartphones	f
389	Samsung Galaxy S10	The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.	699.99	62	\N	2026-01-15 21:53:49.519958	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp	smartphones	f
390	Vivo S1	The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.	249.99	28	\N	2026-01-15 21:53:49.520978	https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp	smartphones	f
391	Vivo V9	The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.	299.99	26	\N	2026-01-15 21:53:49.521651	https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/thumbnail.webp	smartphones	f
392	Vivo X21	The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.	499.99	47	\N	2026-01-15 21:53:49.522205	https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp	smartphones	f
393	Apple MacBook Pro 14 Inch Space Grey	The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.	1999.99	54	\N	2026-01-15 21:53:49.832983	https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp	laptops	f
394	Asus Zenbook Pro Dual Screen Laptop	The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.	1799.99	66	\N	2026-01-15 21:53:49.837114	https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp	laptops	f
395	Huawei Matebook X Pro	The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.	1399.99	40	\N	2026-01-15 21:53:49.838335	https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp	laptops	f
396	Lenovo Yoga 920	The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.	1099.99	70	\N	2026-01-15 21:53:49.839481	https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp	laptops	f
397	New DELL XPS 13 9300 Laptop	The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.	1499.99	27	\N	2026-01-15 21:53:49.840806	https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp	laptops	f
398	Blue & Black Check Shirt	The Blue & Black Check Shirt is a stylish and comfortable men's shirt featuring a classic check pattern. Made from high-quality fabric, it's suitable for both casual and semi-formal occasions.	29.99	31	\N	2026-01-15 21:53:50.235885	https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp	mens-shirts	f
399	Gigabyte Aorus Men Tshirt	The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it's perfect for expressing your gaming style.	24.99	66	\N	2026-01-15 21:53:50.240681	https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp	mens-shirts	f
400	Man Plaid Shirt	The Man Plaid Shirt is a timeless and versatile men's shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.	34.99	23	\N	2026-01-15 21:53:50.241881	https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp	mens-shirts	f
401	Man Short Sleeve Shirt	The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it's perfect for a laid-back yet polished look.	19.99	41	\N	2026-01-15 21:53:50.24313	https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp	mens-shirts	f
402	Men Check Shirt	The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.	27.99	40	\N	2026-01-15 21:53:50.244371	https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp	mens-shirts	f
403	Black Women's Gown	The Black Women's Gown is an elegant and timeless evening gown. With a sleek black design, it's perfect for formal events and special occasions, exuding sophistication and style.	129.99	42	\N	2026-01-15 21:53:50.576942	https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp	womens-dresses	f
404	Corset Leather With Skirt	The Corset Leather With Skirt is a bold and edgy ensemble that combines a stylish corset with a matching skirt. Ideal for fashion-forward individuals, it makes a statement at any event.	89.99	40	\N	2026-01-15 21:53:50.581673	https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp	womens-dresses	f
405	Corset With Black Skirt	The Corset With Black Skirt is a chic and versatile outfit that pairs a fashionable corset with a classic black skirt. It offers a trendy and coordinated look for various occasions.	79.99	60	\N	2026-01-15 21:53:50.583079	https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp	womens-dresses	f
406	Dress Pea	The Dress Pea is a stylish and comfortable dress with a pea pattern. Perfect for casual outings, it adds a playful and fun element to your wardrobe, making it a great choice for day-to-day wear.	49.99	38	\N	2026-01-15 21:53:50.584823	https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp	womens-dresses	f
407	Marni Red & Black Suit	The Marni Red & Black Suit is a sophisticated and fashion-forward suit ensemble. With a combination of red and black tones, it showcases a modern design for a bold and confident look.	179.99	43	\N	2026-01-15 21:53:50.586243	https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp	womens-dresses	f
408	IWC Ingenieur Automatic Steel	The IWC Ingenieur Automatic Steel watch is a durable and sophisticated timepiece. With a stainless steel case and automatic movement, it combines precision and style for watch enthusiasts.	4999.99	53	\N	2026-01-15 21:53:50.987213	https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/thumbnail.webp	womens-watches	f
409	Rolex Cellini Moonphase	The Rolex Cellini Moonphase watch is a masterpiece of horology. Featuring a moon phase complication, it showcases the craftsmanship and elegance that Rolex is renowned for.	15999.99	70	\N	2026-01-15 21:53:50.991879	https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/thumbnail.webp	womens-watches	f
410	Rolex Datejust Women	The Rolex Datejust Women's watch is an iconic timepiece designed for women. With a timeless design and a date complication, it offers both elegance and functionality.	10999.99	59	\N	2026-01-15 21:53:50.993274	https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/thumbnail.webp	womens-watches	f
411	Watch Gold for Women	The Gold Women's Watch is a stunning accessory that combines luxury and style. Featuring a gold-plated case and a chic design, it adds a touch of glamour to any outfit.	799.99	25	\N	2026-01-15 21:53:50.994981	https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp	womens-watches	f
412	Women's Wrist Watch	The Women's Wrist Watch is a versatile and fashionable timepiece for everyday wear. With a comfortable strap and a simple yet elegant design, it complements various styles.	129.99	67	\N	2026-01-15 21:53:50.996325	https://cdn.dummyjson.com/product-images/womens-watches/women's-wrist-watch/thumbnail.webp	womens-watches	f
413	Brown Leather Belt Watch	The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.	89.99	55	\N	2026-01-15 21:53:51.356011	https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp	mens-watches	f
414	Longines Master Collection	The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it's a symbol of luxury and sophistication.	1499.99	28	\N	2026-01-15 21:53:51.36355	https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp	mens-watches	f
415	Rolex Cellini Date Black Dial	The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex's heritage.	8999.99	77	\N	2026-01-15 21:53:51.365431	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp	mens-watches	f
416	Rolex Cellini Moonphase	The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex's commitment to precision and elegance.	12999.99	39	\N	2026-01-15 21:53:51.366501	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp	mens-watches	f
417	Rolex Datejust	The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.	10999.99	57	\N	2026-01-15 21:53:51.367494	https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp	mens-watches	f
418	Rolex Submariner Watch	The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it's a symbol of adventure and exploration.	13999.99	73	\N	2026-01-15 21:53:51.368483	https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp	mens-watches	f
419	Calvin Klein CK One	CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.	49.99	27	\N	2026-01-15 21:53:51.663933	https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp	fragrances	f
449	Protein Powder	Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.	19.99	39	\N	2026-01-15 21:53:52.413593	https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp	groceries	f
420	Chanel Coco Noir Eau De	Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.	129.99	36	\N	2026-01-15 21:53:51.668196	https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp	fragrances	f
421	Dior J'adore	J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.	89.99	41	\N	2026-01-15 21:53:51.669406	https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp	fragrances	f
422	Dolce Shine Eau de	Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.	69.99	24	\N	2026-01-15 21:53:51.670404	https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp	fragrances	f
423	Gucci Bloom Eau de	Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.	79.99	37	\N	2026-01-15 21:53:51.671476	https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp	fragrances	f
424	Essence Mascara Lash Princess	The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.	9.99	27	\N	2026-01-15 21:53:52.072279	https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp	beauty	f
425	Eyeshadow Palette with Mirror	The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.	19.99	31	\N	2026-01-15 21:53:52.077061	https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp	beauty	f
426	Powder Canister	The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.	14.99	24	\N	2026-01-15 21:53:52.079208	https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp	beauty	f
427	Red Lipstick	The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.	12.99	34	\N	2026-01-15 21:53:52.080224	https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp	beauty	f
428	Red Nail Polish	The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.	8.99	65	\N	2026-01-15 21:53:52.081147	https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp	beauty	f
429	Apple	Fresh and crisp apples, perfect for snacking or incorporating into various recipes.	1.99	65	\N	2026-01-15 21:53:52.392511	https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp	groceries	f
430	Beef Steak	High-quality beef steak, great for grilling or cooking to your preferred level of doneness.	12.99	47	\N	2026-01-15 21:53:52.396088	https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp	groceries	f
431	Cat Food	Nutritious cat food formulated to meet the dietary needs of your feline friend.	8.99	20	\N	2026-01-15 21:53:52.397263	https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp	groceries	f
432	Chicken Meat	Fresh and tender chicken meat, suitable for various culinary preparations.	9.99	38	\N	2026-01-15 21:53:52.398417	https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp	groceries	f
433	Cooking Oil	Versatile cooking oil suitable for frying, sautéing, and various culinary applications.	4.99	57	\N	2026-01-15 21:53:52.399738	https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp	groceries	f
434	Cucumber	Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.	1.49	26	\N	2026-01-15 21:53:52.400695	https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp	groceries	f
435	Dog Food	Specially formulated dog food designed to provide essential nutrients for your canine companion.	10.99	54	\N	2026-01-15 21:53:52.402716	https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp	groceries	f
436	Eggs	Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.	2.99	69	\N	2026-01-15 21:53:52.403599	https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp	groceries	f
437	Fish Steak	Quality fish steak, suitable for grilling, baking, or pan-searing.	14.99	32	\N	2026-01-15 21:53:52.40444	https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp	groceries	f
438	Green Bell Pepper	Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.	1.29	78	\N	2026-01-15 21:53:52.405264	https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp	groceries	f
439	Green Chili Pepper	Spicy green chili pepper, ideal for adding heat to your favorite recipes.	0.99	50	\N	2026-01-15 21:53:52.406031	https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp	groceries	f
440	Honey Jar	Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.	6.99	26	\N	2026-01-15 21:53:52.40679	https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp	groceries	f
441	Ice Cream	Creamy and delicious ice cream, available in various flavors for a delightful treat.	5.49	22	\N	2026-01-15 21:53:52.407907	https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp	groceries	f
442	Juice	Refreshing fruit juice, packed with vitamins and great for staying hydrated.	3.99	74	\N	2026-01-15 21:53:52.409188	https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp	groceries	f
443	Kiwi	Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.	2.49	29	\N	2026-01-15 21:53:52.409926	https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp	groceries	f
444	Lemon	Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.	0.79	43	\N	2026-01-15 21:53:52.410589	https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp	groceries	f
445	Milk	Fresh and nutritious milk, a staple for various recipes and daily consumption.	3.49	47	\N	2026-01-15 21:53:52.411356	https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp	groceries	f
446	Mulberry	Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.	4.99	79	\N	2026-01-15 21:53:52.411961	https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp	groceries	f
447	Nescafe Coffee	Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.	7.99	76	\N	2026-01-15 21:53:52.412515	https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp	groceries	f
448	Potatoes	Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.	2.29	72	\N	2026-01-15 21:53:52.413047	https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp	groceries	f
450	Red Onions	Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.	1.99	57	\N	2026-01-15 21:53:52.414105	https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp	groceries	f
451	Rice	High-quality rice, a staple for various cuisines and a versatile base for many dishes.	5.99	41	\N	2026-01-15 21:53:52.414592	https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp	groceries	f
452	Soft Drinks	Assorted soft drinks in various flavors, perfect for refreshing beverages.	1.99	62	\N	2026-01-15 21:53:52.415057	https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp	groceries	f
453	Strawberry	Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.	3.99	51	\N	2026-01-15 21:53:52.415497	https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp	groceries	f
454	Tissue Paper Box	Convenient tissue paper box for everyday use, providing soft and absorbent tissues.	2.49	57	\N	2026-01-15 21:53:52.415956	https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp	groceries	f
455	Water	Pure and refreshing bottled water, essential for staying hydrated throughout the day.	0.99	37	\N	2026-01-15 21:53:52.416672	https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp	groceries	f
456	iPhone 5s	The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.	199.99	50	\N	2026-01-15 21:59:21.892873	https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp	smartphones	f
457	iPhone 6	The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.	299.99	27	\N	2026-01-15 21:59:21.896274	https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp	smartphones	f
458	iPhone 13 Pro	The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.	1099.99	55	\N	2026-01-15 21:59:21.897299	https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp	smartphones	f
459	iPhone X	The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.	899.99	61	\N	2026-01-15 21:59:21.898074	https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp	smartphones	f
460	Oppo A57	The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.	249.99	56	\N	2026-01-15 21:59:21.899067	https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp	smartphones	f
461	Oppo F19 Pro Plus	The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.	399.99	44	\N	2026-01-15 21:59:21.899824	https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp	smartphones	f
462	Oppo K1	The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.	299.99	35	\N	2026-01-15 21:59:21.900503	https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp	smartphones	f
463	Realme C35	The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.	149.99	23	\N	2026-01-15 21:59:21.901157	https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp	smartphones	f
464	Realme X	The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.	299.99	36	\N	2026-01-15 21:59:21.902009	https://cdn.dummyjson.com/product-images/smartphones/realme-x/thumbnail.webp	smartphones	f
465	Realme XT	The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.	349.99	73	\N	2026-01-15 21:59:21.902989	https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp	smartphones	f
466	Samsung Galaxy S7	The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.	299.99	61	\N	2026-01-15 21:59:21.903749	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp	smartphones	f
467	Samsung Galaxy S8	The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.	499.99	67	\N	2026-01-15 21:59:21.904431	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp	smartphones	f
468	Samsung Galaxy S10	The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.	699.99	78	\N	2026-01-15 21:59:21.905134	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp	smartphones	f
469	Vivo S1	The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.	249.99	46	\N	2026-01-15 21:59:21.905914	https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp	smartphones	f
470	Vivo V9	The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.	299.99	32	\N	2026-01-15 21:59:21.906716	https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/thumbnail.webp	smartphones	f
471	Vivo X21	The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.	499.99	47	\N	2026-01-15 21:59:21.907469	https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp	smartphones	f
472	Apple MacBook Pro 14 Inch Space Grey	The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.	1999.99	79	\N	2026-01-15 21:59:22.251406	https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp	laptops	f
473	Asus Zenbook Pro Dual Screen Laptop	The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.	1799.99	78	\N	2026-01-15 21:59:22.255662	https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp	laptops	f
474	Huawei Matebook X Pro	The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.	1399.99	75	\N	2026-01-15 21:59:22.256609	https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp	laptops	f
475	Lenovo Yoga 920	The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.	1099.99	33	\N	2026-01-15 21:59:22.260625	https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp	laptops	f
476	New DELL XPS 13 9300 Laptop	The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.	1499.99	38	\N	2026-01-15 21:59:22.261624	https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp	laptops	f
477	Blue & Black Check Shirt	The Blue & Black Check Shirt is a stylish and comfortable men's shirt featuring a classic check pattern. Made from high-quality fabric, it's suitable for both casual and semi-formal occasions.	29.99	44	\N	2026-01-15 21:59:22.592465	https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp	mens-shirts	f
478	Gigabyte Aorus Men Tshirt	The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it's perfect for expressing your gaming style.	24.99	73	\N	2026-01-15 21:59:22.597646	https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp	mens-shirts	f
479	Man Plaid Shirt	The Man Plaid Shirt is a timeless and versatile men's shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.	34.99	79	\N	2026-01-15 21:59:22.599493	https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp	mens-shirts	f
480	Man Short Sleeve Shirt	The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it's perfect for a laid-back yet polished look.	19.99	25	\N	2026-01-15 21:59:22.601232	https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp	mens-shirts	f
481	Men Check Shirt	The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.	27.99	60	\N	2026-01-15 21:59:22.602821	https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp	mens-shirts	f
482	Black Women's Gown	The Black Women's Gown is an elegant and timeless evening gown. With a sleek black design, it's perfect for formal events and special occasions, exuding sophistication and style.	129.99	77	\N	2026-01-15 21:59:23.014076	https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp	womens-dresses	f
483	Corset Leather With Skirt	The Corset Leather With Skirt is a bold and edgy ensemble that combines a stylish corset with a matching skirt. Ideal for fashion-forward individuals, it makes a statement at any event.	89.99	39	\N	2026-01-15 21:59:23.015235	https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp	womens-dresses	f
484	Corset With Black Skirt	The Corset With Black Skirt is a chic and versatile outfit that pairs a fashionable corset with a classic black skirt. It offers a trendy and coordinated look for various occasions.	79.99	60	\N	2026-01-15 21:59:23.015977	https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp	womens-dresses	f
485	Dress Pea	The Dress Pea is a stylish and comfortable dress with a pea pattern. Perfect for casual outings, it adds a playful and fun element to your wardrobe, making it a great choice for day-to-day wear.	49.99	68	\N	2026-01-15 21:59:23.01666	https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp	womens-dresses	f
486	Marni Red & Black Suit	The Marni Red & Black Suit is a sophisticated and fashion-forward suit ensemble. With a combination of red and black tones, it showcases a modern design for a bold and confident look.	179.99	58	\N	2026-01-15 21:59:23.017336	https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp	womens-dresses	f
487	IWC Ingenieur Automatic Steel	The IWC Ingenieur Automatic Steel watch is a durable and sophisticated timepiece. With a stainless steel case and automatic movement, it combines precision and style for watch enthusiasts.	4999.99	43	\N	2026-01-15 21:59:23.350508	https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/thumbnail.webp	womens-watches	f
488	Rolex Cellini Moonphase	The Rolex Cellini Moonphase watch is a masterpiece of horology. Featuring a moon phase complication, it showcases the craftsmanship and elegance that Rolex is renowned for.	15999.99	74	\N	2026-01-15 21:59:23.356705	https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/thumbnail.webp	womens-watches	f
489	Rolex Datejust Women	The Rolex Datejust Women's watch is an iconic timepiece designed for women. With a timeless design and a date complication, it offers both elegance and functionality.	10999.99	48	\N	2026-01-15 21:59:23.358136	https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/thumbnail.webp	womens-watches	f
490	Watch Gold for Women	The Gold Women's Watch is a stunning accessory that combines luxury and style. Featuring a gold-plated case and a chic design, it adds a touch of glamour to any outfit.	799.99	46	\N	2026-01-15 21:59:23.359559	https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp	womens-watches	f
491	Women's Wrist Watch	The Women's Wrist Watch is a versatile and fashionable timepiece for everyday wear. With a comfortable strap and a simple yet elegant design, it complements various styles.	129.99	79	\N	2026-01-15 21:59:23.361035	https://cdn.dummyjson.com/product-images/womens-watches/women's-wrist-watch/thumbnail.webp	womens-watches	f
492	Brown Leather Belt Watch	The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.	89.99	34	\N	2026-01-15 21:59:23.748086	https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp	mens-watches	f
493	Longines Master Collection	The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it's a symbol of luxury and sophistication.	1499.99	75	\N	2026-01-15 21:59:23.752422	https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp	mens-watches	f
494	Rolex Cellini Date Black Dial	The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex's heritage.	8999.99	51	\N	2026-01-15 21:59:23.753757	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp	mens-watches	f
522	Kiwi	Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.	2.49	52	\N	2026-01-15 21:59:24.799075	https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp	groceries	f
495	Rolex Cellini Moonphase	The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex's commitment to precision and elegance.	12999.99	51	\N	2026-01-15 21:59:23.754928	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp	mens-watches	f
496	Rolex Datejust	The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.	10999.99	70	\N	2026-01-15 21:59:23.755823	https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp	mens-watches	f
497	Rolex Submariner Watch	The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it's a symbol of adventure and exploration.	13999.99	36	\N	2026-01-15 21:59:23.756758	https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp	mens-watches	f
498	Calvin Klein CK One	CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.	49.99	26	\N	2026-01-15 21:59:24.09083	https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp	fragrances	f
499	Chanel Coco Noir Eau De	Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.	129.99	62	\N	2026-01-15 21:59:24.096045	https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp	fragrances	f
500	Dior J'adore	J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.	89.99	77	\N	2026-01-15 21:59:24.097299	https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp	fragrances	f
501	Dolce Shine Eau de	Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.	69.99	29	\N	2026-01-15 21:59:24.098386	https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp	fragrances	f
502	Gucci Bloom Eau de	Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.	79.99	76	\N	2026-01-15 21:59:24.099324	https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp	fragrances	f
503	Essence Mascara Lash Princess	The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.	9.99	49	\N	2026-01-15 21:59:24.461614	https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp	beauty	f
504	Eyeshadow Palette with Mirror	The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.	19.99	76	\N	2026-01-15 21:59:24.4663	https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp	beauty	f
505	Powder Canister	The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.	14.99	41	\N	2026-01-15 21:59:24.467629	https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp	beauty	f
506	Red Lipstick	The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.	12.99	21	\N	2026-01-15 21:59:24.468976	https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp	beauty	f
507	Red Nail Polish	The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.	8.99	27	\N	2026-01-15 21:59:24.470063	https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp	beauty	f
508	Apple	Fresh and crisp apples, perfect for snacking or incorporating into various recipes.	1.99	46	\N	2026-01-15 21:59:24.781846	https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp	groceries	f
509	Beef Steak	High-quality beef steak, great for grilling or cooking to your preferred level of doneness.	12.99	32	\N	2026-01-15 21:59:24.786854	https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp	groceries	f
510	Cat Food	Nutritious cat food formulated to meet the dietary needs of your feline friend.	8.99	49	\N	2026-01-15 21:59:24.788045	https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp	groceries	f
511	Chicken Meat	Fresh and tender chicken meat, suitable for various culinary preparations.	9.99	74	\N	2026-01-15 21:59:24.789034	https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp	groceries	f
512	Cooking Oil	Versatile cooking oil suitable for frying, sautéing, and various culinary applications.	4.99	56	\N	2026-01-15 21:59:24.790104	https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp	groceries	f
513	Cucumber	Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.	1.49	56	\N	2026-01-15 21:59:24.791954	https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp	groceries	f
514	Dog Food	Specially formulated dog food designed to provide essential nutrients for your canine companion.	10.99	59	\N	2026-01-15 21:59:24.793078	https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp	groceries	f
515	Eggs	Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.	2.99	29	\N	2026-01-15 21:59:24.793901	https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp	groceries	f
516	Fish Steak	Quality fish steak, suitable for grilling, baking, or pan-searing.	14.99	68	\N	2026-01-15 21:59:24.794711	https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp	groceries	f
517	Green Bell Pepper	Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.	1.29	55	\N	2026-01-15 21:59:24.795484	https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp	groceries	f
518	Green Chili Pepper	Spicy green chili pepper, ideal for adding heat to your favorite recipes.	0.99	77	\N	2026-01-15 21:59:24.796241	https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp	groceries	f
519	Honey Jar	Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.	6.99	40	\N	2026-01-15 21:59:24.796962	https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp	groceries	f
520	Ice Cream	Creamy and delicious ice cream, available in various flavors for a delightful treat.	5.49	35	\N	2026-01-15 21:59:24.797674	https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp	groceries	f
521	Juice	Refreshing fruit juice, packed with vitamins and great for staying hydrated.	3.99	42	\N	2026-01-15 21:59:24.798371	https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp	groceries	f
523	Lemon	Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.	0.79	54	\N	2026-01-15 21:59:24.799801	https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp	groceries	f
524	Milk	Fresh and nutritious milk, a staple for various recipes and daily consumption.	3.49	71	\N	2026-01-15 21:59:24.800535	https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp	groceries	f
525	Mulberry	Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.	4.99	74	\N	2026-01-15 21:59:24.801473	https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp	groceries	f
526	Nescafe Coffee	Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.	7.99	58	\N	2026-01-15 21:59:24.802192	https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp	groceries	f
527	Potatoes	Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.	2.29	75	\N	2026-01-15 21:59:24.802828	https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp	groceries	f
528	Protein Powder	Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.	19.99	67	\N	2026-01-15 21:59:24.803577	https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp	groceries	f
529	Red Onions	Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.	1.99	75	\N	2026-01-15 21:59:24.804862	https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp	groceries	f
530	Rice	High-quality rice, a staple for various cuisines and a versatile base for many dishes.	5.99	32	\N	2026-01-15 21:59:24.805436	https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp	groceries	f
531	Soft Drinks	Assorted soft drinks in various flavors, perfect for refreshing beverages.	1.99	59	\N	2026-01-15 21:59:24.805956	https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp	groceries	f
532	Strawberry	Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.	3.99	77	\N	2026-01-15 21:59:24.80646	https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp	groceries	f
533	Tissue Paper Box	Convenient tissue paper box for everyday use, providing soft and absorbent tissues.	2.49	36	\N	2026-01-15 21:59:24.806941	https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp	groceries	f
534	Water	Pure and refreshing bottled water, essential for staying hydrated throughout the day.	0.99	24	\N	2026-01-15 21:59:24.807394	https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp	groceries	f
535	Decoration Swing	The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.	59.99	79	\N	2026-01-15 21:59:25.487496	https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp	home-decoration	f
536	Family Tree Photo Frame	The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.	29.99	48	\N	2026-01-15 21:59:25.492341	https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp	home-decoration	f
537	House Showpiece Plant	The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.	39.99	40	\N	2026-01-15 21:59:25.494518	https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp	home-decoration	f
538	Plant Pot	The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.	14.99	21	\N	2026-01-15 21:59:25.495769	https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp	home-decoration	f
539	Table Lamp	The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.	49.99	73	\N	2026-01-15 21:59:25.496896	https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp	home-decoration	f
540	Annibale Colombo Bed	The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.	1899.99	68	\N	2026-01-15 21:59:25.80196	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp	furniture	f
541	Annibale Colombo Sofa	The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.	2499.99	22	\N	2026-01-15 21:59:25.806604	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp	furniture	f
542	Bedside Table African Cherry	The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.	299.99	62	\N	2026-01-15 21:59:25.807972	https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp	furniture	f
543	Knoll Saarinen Executive Conference Chair	The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.	499.99	76	\N	2026-01-15 21:59:25.809905	https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp	furniture	f
544	Wooden Bathroom Sink With Mirror	The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.	799.99	78	\N	2026-01-15 21:59:25.811364	https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp	furniture	f
545	iPhone 5s	The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.	199.99	58	\N	2026-01-15 22:01:05.430115	https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp	smartphones	f
546	iPhone 6	The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.	299.99	37	\N	2026-01-15 22:01:05.433939	https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp	smartphones	f
547	iPhone 13 Pro	The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.	1099.99	24	\N	2026-01-15 22:01:05.434745	https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp	smartphones	f
548	iPhone X	The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.	899.99	65	\N	2026-01-15 22:01:05.435391	https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp	smartphones	f
549	Oppo A57	The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.	249.99	71	\N	2026-01-15 22:01:05.435973	https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp	smartphones	f
550	Oppo F19 Pro Plus	The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.	399.99	62	\N	2026-01-15 22:01:05.436585	https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp	smartphones	f
551	Oppo K1	The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.	299.99	79	\N	2026-01-15 22:01:05.43718	https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp	smartphones	f
552	Realme C35	The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.	149.99	45	\N	2026-01-15 22:01:05.437786	https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp	smartphones	f
553	Realme X	The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.	299.99	27	\N	2026-01-15 22:01:05.43929	https://cdn.dummyjson.com/product-images/smartphones/realme-x/thumbnail.webp	smartphones	f
554	Realme XT	The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.	349.99	68	\N	2026-01-15 22:01:05.440252	https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp	smartphones	f
555	Samsung Galaxy S7	The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.	299.99	29	\N	2026-01-15 22:01:05.441009	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp	smartphones	f
556	Samsung Galaxy S8	The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.	499.99	31	\N	2026-01-15 22:01:05.441634	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp	smartphones	f
557	Samsung Galaxy S10	The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.	699.99	26	\N	2026-01-15 22:01:05.442262	https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp	smartphones	f
558	Vivo S1	The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.	249.99	59	\N	2026-01-15 22:01:05.442895	https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp	smartphones	f
559	Vivo V9	The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.	299.99	71	\N	2026-01-15 22:01:05.443651	https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/thumbnail.webp	smartphones	f
560	Vivo X21	The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.	499.99	76	\N	2026-01-15 22:01:05.444199	https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp	smartphones	f
561	Apple MacBook Pro 14 Inch Space Grey	The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.	1999.99	78	\N	2026-01-15 22:01:05.744874	https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp	laptops	f
562	Asus Zenbook Pro Dual Screen Laptop	The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.	1799.99	40	\N	2026-01-15 22:01:05.748799	https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp	laptops	f
563	Huawei Matebook X Pro	The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.	1399.99	39	\N	2026-01-15 22:01:05.74974	https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp	laptops	f
564	Lenovo Yoga 920	The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.	1099.99	22	\N	2026-01-15 22:01:05.756064	https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp	laptops	f
565	New DELL XPS 13 9300 Laptop	The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.	1499.99	55	\N	2026-01-15 22:01:05.757095	https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp	laptops	f
566	Blue & Black Check Shirt	The Blue & Black Check Shirt is a stylish and comfortable men's shirt featuring a classic check pattern. Made from high-quality fabric, it's suitable for both casual and semi-formal occasions.	29.99	79	\N	2026-01-15 22:01:06.097109	https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp	mens-shirts	f
567	Gigabyte Aorus Men Tshirt	The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it's perfect for expressing your gaming style.	24.99	61	\N	2026-01-15 22:01:06.100825	https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp	mens-shirts	f
568	Man Plaid Shirt	The Man Plaid Shirt is a timeless and versatile men's shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.	34.99	28	\N	2026-01-15 22:01:06.10193	https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp	mens-shirts	f
569	Man Short Sleeve Shirt	The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it's perfect for a laid-back yet polished look.	19.99	36	\N	2026-01-15 22:01:06.103093	https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp	mens-shirts	f
570	Men Check Shirt	The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.	27.99	29	\N	2026-01-15 22:01:06.103963	https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp	mens-shirts	f
571	Black Women's Gown	The Black Women's Gown is an elegant and timeless evening gown. With a sleek black design, it's perfect for formal events and special occasions, exuding sophistication and style.	129.99	74	\N	2026-01-15 22:01:06.366198	https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp	womens-dresses	f
572	Corset Leather With Skirt	The Corset Leather With Skirt is a bold and edgy ensemble that combines a stylish corset with a matching skirt. Ideal for fashion-forward individuals, it makes a statement at any event.	89.99	36	\N	2026-01-15 22:01:06.369707	https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp	womens-dresses	f
573	Corset With Black Skirt	The Corset With Black Skirt is a chic and versatile outfit that pairs a fashionable corset with a classic black skirt. It offers a trendy and coordinated look for various occasions.	79.99	33	\N	2026-01-15 22:01:06.37043	https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp	womens-dresses	f
574	Dress Pea	The Dress Pea is a stylish and comfortable dress with a pea pattern. Perfect for casual outings, it adds a playful and fun element to your wardrobe, making it a great choice for day-to-day wear.	49.99	56	\N	2026-01-15 22:01:06.371276	https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp	womens-dresses	f
575	Marni Red & Black Suit	The Marni Red & Black Suit is a sophisticated and fashion-forward suit ensemble. With a combination of red and black tones, it showcases a modern design for a bold and confident look.	179.99	75	\N	2026-01-15 22:01:06.371954	https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp	womens-dresses	f
577	Rolex Cellini Moonphase	The Rolex Cellini Moonphase watch is a masterpiece of horology. Featuring a moon phase complication, it showcases the craftsmanship and elegance that Rolex is renowned for.	15999.99	34	\N	2026-01-15 22:01:06.65223	https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/thumbnail.webp	womens-watches	f
578	Rolex Datejust Women	The Rolex Datejust Women's watch is an iconic timepiece designed for women. With a timeless design and a date complication, it offers both elegance and functionality.	10999.99	73	\N	2026-01-15 22:01:06.654266	https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/thumbnail.webp	womens-watches	f
579	Watch Gold for Women	The Gold Women's Watch is a stunning accessory that combines luxury and style. Featuring a gold-plated case and a chic design, it adds a touch of glamour to any outfit.	799.99	28	\N	2026-01-15 22:01:06.65511	https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp	womens-watches	f
580	Women's Wrist Watch	The Women's Wrist Watch is a versatile and fashionable timepiece for everyday wear. With a comfortable strap and a simple yet elegant design, it complements various styles.	129.99	59	\N	2026-01-15 22:01:06.65595	https://cdn.dummyjson.com/product-images/womens-watches/women's-wrist-watch/thumbnail.webp	womens-watches	f
581	Brown Leather Belt Watch	The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.	89.99	75	\N	2026-01-15 22:01:06.977017	https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp	mens-watches	f
582	Longines Master Collection	The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it's a symbol of luxury and sophistication.	1499.99	22	\N	2026-01-15 22:01:06.980902	https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp	mens-watches	f
583	Rolex Cellini Date Black Dial	The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex's heritage.	8999.99	55	\N	2026-01-15 22:01:06.982107	https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp	mens-watches	f
586	Rolex Submariner Watch	The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it's a symbol of adventure and exploration.	13999.99	47	\N	2026-01-15 22:01:06.984233	https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp	mens-watches	f
587	Calvin Klein CK One	CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.	49.99	37	\N	2026-01-15 22:01:07.253397	https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp	fragrances	f
588	Chanel Coco Noir Eau De	Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.	129.99	23	\N	2026-01-15 22:01:07.258671	https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp	fragrances	f
589	Dior J'adore	J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.	89.99	32	\N	2026-01-15 22:01:07.260416	https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp	fragrances	f
590	Dolce Shine Eau de	Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.	69.99	39	\N	2026-01-15 22:01:07.261633	https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp	fragrances	f
591	Gucci Bloom Eau de	Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.	79.99	67	\N	2026-01-15 22:01:07.262726	https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp	fragrances	f
592	Essence Mascara Lash Princess	The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.	9.99	22	\N	2026-01-15 22:01:07.52377	https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp	beauty	f
576	IWC Ingenieur Automatic Steel	The IWC Ingenieur Automatic Steel watch is a durable and sophisticated timepiece. With a stainless steel case and automatic movement, it combines precision and style for watch enthusiasts.	4999.99	22	\N	2026-01-15 22:01:06.650954	https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/thumbnail.webp	womens-watches	f
593	Eyeshadow Palette with Mirror	The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.	19.99	78	\N	2026-01-15 22:01:07.530148	https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp	beauty	f
594	Powder Canister	The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.	14.99	37	\N	2026-01-15 22:01:07.53199	https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp	beauty	f
595	Red Lipstick	The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.	12.99	55	\N	2026-01-15 22:01:07.533514	https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp	beauty	f
596	Red Nail Polish	The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.	8.99	33	\N	2026-01-15 22:01:07.535032	https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp	beauty	f
597	Apple	Fresh and crisp apples, perfect for snacking or incorporating into various recipes.	1.99	56	\N	2026-01-15 22:01:07.800047	https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp	groceries	f
598	Beef Steak	High-quality beef steak, great for grilling or cooking to your preferred level of doneness.	12.99	60	\N	2026-01-15 22:01:07.803443	https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp	groceries	f
599	Cat Food	Nutritious cat food formulated to meet the dietary needs of your feline friend.	8.99	36	\N	2026-01-15 22:01:07.804147	https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp	groceries	f
600	Chicken Meat	Fresh and tender chicken meat, suitable for various culinary preparations.	9.99	53	\N	2026-01-15 22:01:07.804758	https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp	groceries	f
601	Cooking Oil	Versatile cooking oil suitable for frying, sautéing, and various culinary applications.	4.99	68	\N	2026-01-15 22:01:07.805432	https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp	groceries	f
602	Cucumber	Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.	1.49	44	\N	2026-01-15 22:01:07.806638	https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp	groceries	f
603	Dog Food	Specially formulated dog food designed to provide essential nutrients for your canine companion.	10.99	40	\N	2026-01-15 22:01:07.807223	https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp	groceries	f
604	Eggs	Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.	2.99	69	\N	2026-01-15 22:01:07.808544	https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp	groceries	f
605	Fish Steak	Quality fish steak, suitable for grilling, baking, or pan-searing.	14.99	35	\N	2026-01-15 22:01:07.809127	https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp	groceries	f
606	Green Bell Pepper	Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.	1.29	65	\N	2026-01-15 22:01:07.809905	https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp	groceries	f
607	Green Chili Pepper	Spicy green chili pepper, ideal for adding heat to your favorite recipes.	0.99	75	\N	2026-01-15 22:01:07.810688	https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp	groceries	f
608	Honey Jar	Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.	6.99	79	\N	2026-01-15 22:01:07.81145	https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp	groceries	f
609	Ice Cream	Creamy and delicious ice cream, available in various flavors for a delightful treat.	5.49	72	\N	2026-01-15 22:01:07.81218	https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp	groceries	f
610	Juice	Refreshing fruit juice, packed with vitamins and great for staying hydrated.	3.99	47	\N	2026-01-15 22:01:07.812901	https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp	groceries	f
611	Kiwi	Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.	2.49	59	\N	2026-01-15 22:01:07.813606	https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp	groceries	f
612	Lemon	Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.	0.79	28	\N	2026-01-15 22:01:07.814336	https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp	groceries	f
614	Mulberry	Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.	4.99	63	\N	2026-01-15 22:01:07.815736	https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp	groceries	f
615	Nescafe Coffee	Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.	7.99	79	\N	2026-01-15 22:01:07.81707	https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp	groceries	f
616	Potatoes	Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.	2.29	53	\N	2026-01-15 22:01:07.817848	https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp	groceries	f
618	Red Onions	Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.	1.99	71	\N	2026-01-15 22:01:07.818927	https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp	groceries	f
619	Rice	High-quality rice, a staple for various cuisines and a versatile base for many dishes.	5.99	37	\N	2026-01-15 22:01:07.819409	https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp	groceries	f
622	Tissue Paper Box	Convenient tissue paper box for everyday use, providing soft and absorbent tissues.	2.49	63	\N	2026-01-15 22:01:07.820893	https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp	groceries	f
623	Water	Pure and refreshing bottled water, essential for staying hydrated throughout the day.	0.99	32	\N	2026-01-15 22:01:07.821349	https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp	groceries	f
613	Milk	Fresh and nutritious milk, a staple for various recipes and daily consumption.	3.49	78	\N	2026-01-15 22:01:07.815028	https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp	groceries	f
621	Strawberry	Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.	3.99	77	\N	2026-01-15 22:01:07.820416	https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp	groceries	f
620	Soft Drinks	Assorted soft drinks in various flavors, perfect for refreshing beverages.	1.99	71	\N	2026-01-15 22:01:07.819866	https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp	groceries	f
624	Decoration Swing	The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.	59.99	34	\N	2026-01-15 22:01:08.363438	https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp	home-decoration	f
625	Family Tree Photo Frame	The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.	29.99	22	\N	2026-01-15 22:01:08.364388	https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp	home-decoration	f
629	Annibale Colombo Bed	The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.	1899.99	66	\N	2026-01-15 22:01:08.649329	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp	furniture	f
631	Bedside Table African Cherry	The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.	299.99	42	\N	2026-01-15 22:01:08.655014	https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp	furniture	f
635	Classic Sun Glasses	The Classic Sun Glasses offer a timeless design with a neutral frame and UV-protected lenses. These sunglasses are versatile and suitable for various occasions.	24.99	64	\N	2026-01-15 22:01:09.185856	https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp	sunglasses	f
633	Wooden Bathroom Sink With Mirror	The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.	799.99	50	\N	2026-01-15 22:01:08.657734	https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp	furniture	f
632	Knoll Saarinen Executive Conference Chair	The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.	499.99	67	\N	2026-01-15 22:01:08.656347	https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp	furniture	f
630	Annibale Colombo Sofa	The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.	2499.99	27	\N	2026-01-15 22:01:08.653569	https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp	furniture	f
626	House Showpiece Plant	The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.	39.99	59	\N	2026-01-15 22:01:08.365117	https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp	home-decoration	f
637	Party Glasses	The Party Glasses are designed to add flair to your party outfit. With unique shapes or colorful frames, they're perfect for adding a playful touch to your look during celebrations.	19.99	14	\N	2026-01-15 22:01:09.18894	https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp	sunglasses	f
636	Green and Black Glasses	The Green and Black Glasses feature a bold combination of green and black colors, adding a touch of vibrancy to your eyewear collection. They are both stylish and eye-catching.	34.99	58	\N	2026-01-15 22:01:09.187449	https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp	sunglasses	f
638	Sunglasses	The Sunglasses offer a classic and simple design with a focus on functionality. These sunglasses provide essential UV protection while maintaining a timeless look.	22.99	30	\N	2026-01-15 22:01:09.1903	https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp	sunglasses	f
634	Black Sun Glasses	The Black Sun Glasses are a classic and stylish choice, featuring a sleek black frame and tinted lenses. They provide both UV protection and a fashionable look.	29.99	60	\N	2026-01-15 22:01:09.180856	https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp	sunglasses	f
\.


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refunds (id, order_id, razorpay_payment_id, razorpay_refund_id, amount, status, created_at) FROM stdin;
13	105	pay_S5QD77XMGxzvxo	rfnd_S5QEcncTbMEhkM	34.99	processed	2026-01-18 22:51:55.389515
14	106	pay_S5RFk7PF1iA7km	rfnd_S5RNow5tIi9Il4	22.99	processed	2026-01-18 23:59:19.148022
15	111	pay_S5gcnz4BWwgx23	rfnd_S5ggn5fY16wVsz	22.99	processed	2026-01-19 14:57:40.496378
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
1	Rakesh	rakesh@test.com	$2b$10$fNEPfOfCz4eeHWEQfAvwuuhx8FPLXXkntoOU6OHHGSriGlKZCj17C	admin	2026-01-02 15:53:05.682228
2	srv	srakesh@gmail.com	$2b$10$q0kXVTzL9.iee5/EsHa9tuK.StTRfeP9MexThZWwqHibJ.VT/adLm	user	2026-01-18 15:22:42.046788
3	SRV	srakeshvarma04@gmail.com	$2b$10$DH2zBxwNqXt6UE/tfGPlteHRxuR4eZHldrcYmb2Kv6cEUOMPEOmQi	user	2026-01-19 21:34:00.390216
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (id, user_id, product_id, created_at) FROM stdin;
1	3	638	2026-01-19 22:33:12.659251
2	3	637	2026-01-19 22:44:07.481532
3	3	636	2026-01-19 22:44:10.149142
4	3	633	2026-01-19 22:44:13.130959
10	3	629	2026-01-19 22:57:35.633594
19	1	631	2026-01-20 01:57:07.085898
\.


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 212, true);


--
-- Name: order_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_addresses_id_seq', 20, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 141, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 126, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 64, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 638, true);


--
-- Name: refunds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refunds_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 21, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart cart_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: order_addresses order_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses
    ADD CONSTRAINT order_addresses_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);


--
-- Name: payments unique_razorpay_payment_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT unique_razorpay_payment_id UNIQUE (razorpay_payment_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_addresses order_addresses_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses
    ADD CONSTRAINT order_addresses_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: refunds refunds_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart_items TO srvar;


--
-- Name: SEQUENCE cart_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cart_items_id_seq TO srvar;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO srvar;


--
-- Name: SEQUENCE order_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_items_id_seq TO srvar;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO srvar;


--
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.orders_id_seq TO srvar;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO srvar;


--
-- Name: SEQUENCE payments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payments_id_seq TO srvar;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO srvar;


--
-- Name: SEQUENCE products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.products_id_seq TO srvar;


--
-- Name: TABLE refunds; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.refunds TO srvar;


--
-- Name: SEQUENCE refunds_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.refunds_id_seq TO srvar;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO srvar;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO srvar;


--
-- PostgreSQL database dump complete
--

\unrestrict jOlbLlxd8fpuVtCKEhrzeNlTyABFNJc8PXCQ4MNReTn7dcsepaWDymqbY3QIEgF

