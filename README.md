Step 1:

composer install
npm install

step 2:
cp .env.example .env

step 3:
php artisan migrate

step 4:
php artisan key:generate

step 5:
composer run dev

step 6 build a desktop app:
npm run electron:build
