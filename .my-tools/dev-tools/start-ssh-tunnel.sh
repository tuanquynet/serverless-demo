# ssh tunnel for mysql.tuanquynet.click, we need to enable `GatewayPorts yes` on ssh server
ssh root@172.105.115.152 -R 3306:localhost:3306
