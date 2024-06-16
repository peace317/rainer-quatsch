FROM mongo

USER root

COPY ./mongodb/replica.key /data/replica.key

COPY ./mongodb/mongodb_rs_init.sh /scripts/mongodb_rs_init.sh

RUN chmod 400 /data/replica.key
RUN chown 999:999 /data/replica.key

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["mongod"]