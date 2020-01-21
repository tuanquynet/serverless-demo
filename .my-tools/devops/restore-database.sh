DATABASE=serverless-practice
DB_USERNAME=demo
DB_PASSWORD=share123!
PORT=3307

DATE=`date +%Y-%m-%d`


if [ $1 ]
then
  FILE_NAME=dumpfilename-$DATE-$1;
else
  FILE_NAME=dumpfilename-$DATE;
fi;

echo "Drop database"
mysql -h 127.0.0.1 --port=$PORT  -u $DB_USERNAME --password=$DB_PASSWORD -e "DROP DATABASE $DATABASE";

echo "Create database $DATABASE"
mysql -h 127.0.0.1 --port=$PORT  -u $DB_USERNAME  --password=$DB_PASSWORD -e "CREATE DATABASE \`$DATABASE\`"
# grant permission to greatpeople user.
# mysql -e "GRANT ALL PRIVILEGES ON $DATABASE.* TO greatpeople@127.0.0.1 IDENTIFIED BY '$DB_PASSWORD!'"

if [ $1 ]
then
  DATE=$1
else
  DATE=`date +%Y-%m-%d`;
fi;

DDL_FILE=dumpfilename-$DATE-ddl.sql
DATA_FILE=dumpfilename-$DATE-data.sql

echo "Create data structure";
mysql -h 127.0.0.1 --port=$PORT  -u $DB_USERNAME --password=$DB_PASSWORD  $DATABASE  < .my-tools/backup/$DDL_FILE

echo "Import data";
mysql -h 127.0.0.1 --port=$PORT  -u $DB_USERNAME --password=$DB_PASSWORD  $DATABASE  < .my-tools/backup/$DATA_FILE
