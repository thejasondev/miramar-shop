"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    upload: {
        config: {
            provider: '@strapi/provider-upload-cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
                params: {
                    folder: 'miramar-shop',
                    resource_type: 'auto',
                    transformation: {
                        quality: 'auto:good',
                        fetch_format: 'auto',
                    },
                },
            },
            actionOptions: {
                upload: {
                    folder: 'miramar-shop',
                },
                uploadStream: {
                    folder: 'miramar-shop',
                },
                delete: {},
            },
        },
    },
});
