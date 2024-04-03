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

