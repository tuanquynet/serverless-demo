# login with root
# mysql -u root

# Create user `demo`
CREATE USER 'demo'@'%' IDENTIFIED BY 'share123!';

# Be careful: this statement grant on privileged to demo
GRANT ALL PRIVILEGES ON *.* TO 'demo'@'%' WITH GRANT OPTION;
