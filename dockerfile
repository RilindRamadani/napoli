# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Environment variables for configuring PostgreSQL
ENV POSTGRES_DB=daja-restoraunt
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy SQL scripts to initialize the database (if needed)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432

# Start PostgreSQL when the container starts
CMD ["postgres"]
