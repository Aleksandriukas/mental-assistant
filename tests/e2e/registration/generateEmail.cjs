const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
var username = '';
for (var i = 0; i < 10; i++) {
  username += characters.charAt(Math.floor(Math.random() * characters.length));
}
output.email = `${username}@gmail.com`;
