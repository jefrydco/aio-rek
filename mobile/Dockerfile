FROM node:lts-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY package.json /app/
COPY . /app
# RUN yarn build

# Install packages for node-canvas
RUN apk --no-cache --virtual .build-deps add \
        python \
        make \
        g++ \
    && apk --no-cache --virtual .canvas-build-deps add \
        build-base \
        cairo-dev \
        jpeg-dev \
        pango-dev \
        giflib-dev \
        pixman-dev \
        pangomm-dev \
        libjpeg-turbo-dev \
        freetype-dev \
    && apk --no-cache add \
        pixman \
        cairo \
        pango \
        giflib \
    && yarn --build-from-source
    # && apk del .build-deps \
    # && apk del .canvas-build-deps

# Clear the cache
RUN yarn cache clean

EXPOSE 3000
CMD [ "yarn", "dev" ]