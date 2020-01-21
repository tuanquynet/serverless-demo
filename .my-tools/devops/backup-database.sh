DATABASE=serverless-practice
DB_USERNAME=demo

DATE=`date +%Y-%m-%d`


if [ $1 ]
then
  FILE_NAME=dumpfilename-$DATE-$1;
else
  FILE_NAME=dumpfilename-$DATE;
fi;

echo "dump data & structure without creating trigger";

# export structure, stored procedure, function, trigger
echo "We should remove database-name prefix before trigger name"
mysqldump -h localhost -u $DB_USERNAME --password=share123! $DATABASE \
  --no-data \
  --routines --triggers \
  > .my-tools/backup/$FILE_NAME-ddl.sql;

# export structure, stored procedure, function, trigger
mysqldump -h localhost -u $DB_USERNAME --password=share123! $DATABASE \
  --no-create-info \
  --skip-triggers \
  > .my-tools/backup/$FILE_NAME-data.sql;
