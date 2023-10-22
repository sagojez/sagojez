---
title: "Comprehensive Rust | Day 9"
summary: "In this post we'll cover unit tests in Rust"
date: 2023-10-20T10:00:00+00:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 9"
    caption: "Comprehensive Rust | Day 9"
series: ["Comprehensive Rust"]
---

## Unit Tests

Tests are marked with `#[test]`, to run them we use `cargo test`:

```rust
fn first_word(text: &str) -> &str {
    match text.find(' ') {
        Some(idx) => &text[..idx],
        None => &text,
    }
}

#[test]
fn test_empty() {
    assert_eq!(first_word(""), "");
}

#[test]
fn test_single_word() {
    assert_eq!(first_word("Hello"), "Hello");
}

#[test]
fn test_multiple_words() {
    assert_eq!(first_word("Hello World"), "Hello");
}
```

They're usually placed in a nested module inside the file you're
trying to test:

```rust
fn helper(a: &str, b: &str) -> String {
    format!("{a} {b}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_helper() {
        assert_eq!(helper("foo", "bar"), "foo bar");
    }
}
```

### Documentation Tests

```rust
/// Shortens a string to the given length.
///
/// ```
/// # use playground::shorten_string;
/// assert_eq!(shorten_string("Hello World", 5), "Hello");
/// assert_eq!(shorten_string("Hello World", 20), "Hello World");
/// ```
pub fn shorten_string(s: &str, length: usize) -> &str {
    &s[..std::cmp::min(length, s.len())]
}
```

These comments will be executed when we run `cargo test`. The triple
`///` lets rust compiler know that this comments must be read or
executed if they contain any code on them.

Adding `#` in the code will hide it from the docs, but will still compile/run it.

### Integration Tests

If you want to test your library as a client, use integration test. To do so
you need to create a `.rs` file under `tests/`:

```rust
use my_library::init;

#[test]
fn test_init() {
    assert!(init().is_ok());
}
```

**Note**: For the reader to review if wanted about [`unsafe rust`](https://gist.github.com/samgj18/f2030bd6d53520039637631559b9f8c0).
