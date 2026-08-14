---
title: Colophon
---

# Colophon

Spanner is an indie vehicle maintenance tool built and maintained by [@nicinabox](http://nicinabox.com) since 2014. It has been crafted with consideration for ease of use, speed, and low cost. The project is open source, privacy-minded, and self-hostable.

It's designed for use with a wide range of vehicles including cars, motorcycles, race bikes, tractors, and boats (even a helicopter mechanic was consulted) in both imperial and metric units. 

Spanner works on the web, on desktop or mobile, and can be installed on your device as a progressive web app (PWA).

## Technical

The frontend stack is built on **Sveltekit** with Typescript. Styling is done with **Tailwind** and the design is handcrafted. **Zag** is used for stateful component logic and accessibilty. Icons are from **Lucide**. Font is **Inter**. 

Backend is **Ruby on Rails** using **Postgres** as the database. 

## Hosting

Currently hosted on **Railway** with autodeploys from [GitHub](https://github.com/nicinabox/spanner). Attachments are stored in a private S3-compatible bucket. Transactional email is delivered by **Postmark**.

You can [self-host your own](https://github.com/nicinabox/spanner#self-hosted-deployment) using Docker.

## Feature Philosophy

Spanner focuses on a core feature set for hobbyists and regular folks who have busy lives. It is not a shop inventory tracker, fuel tracker, or project planner. It is recommended to use purpose-built tools if you need these features.
