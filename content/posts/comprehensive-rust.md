---
title: "Comprehensive Rust"
date: 2023-04-28T19:00:00+02:00
draft: false
tags: ["rust"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust"
    caption: "Comprehensive Rust"
---

This is a log of me going through the [Comprehensive Rust](https://google.github.io/comprehensive-rust/running-the-course/course-structure.html)
four days course. There's no structure to this, so be prepared for a lot of rambling and writing... or not 😝. **This log will be updated as I go through the course.**

Some key concepts to keep in work with Rust:

- `rustc`: the Rust compiler which turns `.rs` files into binaries and other intermediate formats.
- `cargo`: the Rust dependency manager and build tool. Think of it as the npm of Rust.
- `rustup`: This tool is used to install and update rustc and cargo when new versions of Rust is released. In addition, rustup can also download documentation for the standard library. You can have multiple versions of Rust installed at once and rustup will let you switch between them as needed.

Also [here](https://google.github.io/comprehensive-rust/cargo/rust-ecosystem.html#speaker-notes-open) you can find some speaker notes

**Beware**: I'm not a Rust expert, so I might be wrong in some of the things I write here. If you find something wrong, please let me know. Also, what I call _days_ in this guide does
not necessarily correspond to the actual days I spent or the days the course is divided into. I might spend more than one day on a single section or I might spend a day on multiple sections.

I personally use [neovim](https://neovim.io/) as my main editor, so I have all my [configuration in a public repository. This a very sensible and specially crafted configuration
for my needs](https://github.com/samgj18/.dotfiles), so I don't recommend you to use it as is. However, you can take a look and get some ideas for your own configuration. If you, like me, only find yourself using
Scala and Rust in your daily basis feel free to use it as it is specially crafted for those two languages.

For more general purpose configurations I strongly recommend you to take a look at [neovim kickstarter](https://github.com/nvim-lua/kickstart.nvim).
