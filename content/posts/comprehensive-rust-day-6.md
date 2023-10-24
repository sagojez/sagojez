---
title: "Comprehensive Rust | Day 6"
summary: "Generics and traits in Rust"
date: 2023-07-01T11:00:00+02:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 6"
    caption: "Comprehensive Rust | Day 6"
series: ["Comprehensive Rust"]
---

## Generics
Generics can be used to abstract over concrete types:

```rust
struct Point<T> {
    x: T,
    y: T,
}
```

This is also extendable to `impl` blocks:

```rust
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
```

As implementations are tightly coupled with the type, it is possible to implement
methods for `Point<f32>`. However, if you want to implement a method for type `T`
this has to be `generically independent` which is why the syntax forces you to be
"reduntant" and specify the `generically independent` type:

```rust
impl<T> Point<T> {};
```

### Monomorphization

Rust uses a technique called `monomorphization` to turn generic code into specific
code by filling in the concrete types that are used when compiled. This is why
generic code is just as fast as non-generic code.

```rust
let integer = Some(5);
let float = Some(5.0);

// Will be compiled to:

enum Option_i32 {
    Some(i32),
    None,
}

enum Option_f64 {
    Some(f64),
    None,
}

let integer = Option_i32::Some(5);
let float = Option_f64::Some(5.0);
```

## Traits

Rust favours `traits` over `inheritance` as it allows for code reuse in a more
flexible way.

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct NewsArticle {
    headline: String,
    location: String,
    author: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}
```

### Static Dispatching vs Dynamic Dispatching

`Static dispatching` is when the compiler knows which method to call at compile
time. This is possible when the compiler knows all the types that might be used
with the code that is calling the method.

`Dynamic dispatching` is when the compiler can't tell which method to call at
compile time. This is possible when the compiler doesn't know all the types that
might be used with the code that is calling the method.

See an excellent explanation [here](https://www.linkedin.com/pulse/dynamic-static-dispatch-rust-amit-nadiger/).

### Trait Objects

This allows for objects of different types to be stored in the same data structure.

```rust
trait Pet {
    fn name(&self) -> String;
}

struct Cat; // Zero sized type

impl Pet for Cat {
    fn name(&self) -> String {
        String::from("Cat")
    }
}

struct Dog; // Zero sized type

impl Pet for Dog {
    fn name(&self) -> String {
        String::from("Dog")
    }
}

fn main() {
    let pets: Vec<Box<dyn Pet>> = vec![
        Box::new(Cat),
        Box::new(Dog { name: String::from("Fido") }),
    ];
    for pet in pets {
        println!("Hello {}!", pet.name());
    }
}
```

**Note**: The memory layout for the previous example is as follows:

```goat
 Stack                             Heap
.---------------------------.     .---------------------------------------------.
|                           |     |                                             |
|    pets                   |     |                                             |
|   .-----------+-------.   |     |   .-----+-----.                             |
|   | ptr       |   o---+---+-----+-->| o o | o o |                             |
|   | len       |     2 |   |     |   '-|-|-+-|-|-'                             |
|   | capacity  |     2 |   |     |     | |   | |   .---------------.           |
|   '-----------+-------'   |     |     | |   | '-->| name| "Fido"  |           |
|                           |     |     | |   |     '---------------'           |
'---------------------------'     |     | |   |                                 |
                                  |     | |   |     .----------------------.    |   
                                  |     | |   '---->| "<Dog as Pet>|name"  |    |
                                  |     | |         '----------------------'    | 
                                  |     | |                                     | 
                                  |     | |   +-+                               |   
                                  |     | '-->|\|                               |     
                                  |     |     +-+                               |    
                                  |     |                                       | 
                                  |     |     .---------------------.           | 
                                  |     '---->| "<Cat as Pet>|name" |           | 
                                  |           '---------------------'           |
                                  |                                             |
                                  '---------------------------------------------'

```

**Notes**:

- `Traits` may have different sizes, hence it is impossible to do things like
  `let pets: Vec<Pet> = vec![Cat, Dog];` as the compiler doesn't know how much
  memory to allocate for each element.
- In the previous example, `pets` holds a _fat pointers_ to the heap. A _fat
  pointer_ is a pointer to the data and a pointer to the `vtable` which contains
  the information about the methods that can be called on the data. 
  See [fat pointers](https://stackoverflow.com/questions/57754901/what-is-a-fat-pointer).

### Deriving Traits

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!("rect1 is {:?}", rect1);
}
```

### Trait Bounds

This is very common way to specify that a generic can use or call methods from
a trait. You can do this with `T: Trait or impl Trait or using where clauses`.

```rust
fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

fn notify<T: Summary>(item: T) {
    println!("Breaking news! {}", item.summarize());
}

fn notify<T>(item: T)
    where T: Summary // In this case, the where clause allows an extra
    // features which is that the type on the left of the ':' can be
    // arbitrary, i.e. Option<T> or Vec<T> or any other type.
{
    println!("Breaking news! {}", item.summarize());
}
```

### Returning Trait | Trait Parameters

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    }
}

fn accepts_summarizable(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```


