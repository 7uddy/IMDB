## Key Features

- **Movie Search**: Quickly search for movies by title or category.
- **Movie Discovery**: Explore new movies based on popular genres, ratings, and recommendations.
- **Reviews**: Leave reviews for movies you’ve watched and see what other users think.
- **Movie Ratings**: Rate movies using a 1 to 10-star system.
- **Categories**: Movies are organized into categories such as action, comedy, drama, horror, science fiction, and more.
- **User-Friendly Interface**: An easy-to-use design for a pleasant experience on all devices.

## Technologies Used

- **Frontend**: Angular
- **Backend**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Movie API**: [The Movie Database (TMDb)](https://www.themoviedb.org/documentation/api)

### Prerequisites

- PHP (v7.4 sau mai recent)
- Composer (pentru Laravel)
- Node.js (v14 sau mai recent)
- Angular CLI
- MySQL

### Backend Setup
```bash
git clone https://github.com/7uddy/IMDB.git
cd IMDB
cd backend
composer install
```
### Configure the .env file
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=imdb
DB_USERNAME=root
DB_PASSWORD=

TMDB_API_KEY=your_tmdb_api_key
```
### Run migrations
```bash
php artisan migrate
```
### Start the Laravel server
```bash
php artisan serve
```
### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

