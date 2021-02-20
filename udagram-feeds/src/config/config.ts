export const config = {
  'username': process.env.POSTGRES_USERNAME || 'udacity',
  'password': process.env.POSTGRES_PASSWORD || 'udacity',
  'database': process.env.POSTGRES_DB || 'udagram',
  'host': process.env.POSTGRES_HOST || 'localhost',
  'dialect': 'postgres',
  'aws_region': process.env.AWS_REGION,
  'aws_profile': process.env.AWS_PROFILE,
  'aws_media_bucket': process.env.AWS_BUCKET,
  'url': process.env.URL,
  'jwt': {
    'secret': process.env.JWT_SECRET || 'somesecret',
  },
};