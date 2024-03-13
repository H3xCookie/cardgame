FROM postgres:latest

ENV POSTGRES_USER user
ENV POSTGRES_PASSWORD 1234
ENV POSTGRES_DB cardgame

COPY ./DATA.sql /docker-entrypoint-initdb.d/
