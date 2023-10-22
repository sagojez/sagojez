---
title: "Polymorphism in Plain English"
summary: "When we hear polymorphism, the first thing that comes to mind is generics. However, polymorphism is a much richer concept than that. In this short post we will be exploring the different types of polymorphism and how we can achieve them in Scala… in plain English."
date: 2023-04-20T20:50:51Z
draft: false
tags: ["scala", "polymorphism", "programming"]
categories: ["programming"]
cover:
    alt: "Polymorphism in Plain English"
    caption: "Polymorphism in Plain English"
---

Polymorphism is a fundamental concept in programming, allowing us to write code that can work with different data types or structures. When we hear the term "polymorphism," generics often come to mind first. However, polymorphism encompasses a broader range of ideas. In this post, we'll explore the various types of polymorphism and how they can be implemented in Scala, all explained in plain English.

## Parametric Polymorphism

### What is Parametric Polymorphism?

Parametric polymorphism, commonly known as generics, involves using a parameter to define the type of behavior we want to achieve with our code.

### Where is it used?

This type of polymorphism is prevalent in both Object-Oriented and Functional Programming paradigms. For instance, when working with a List in Scala, we can specify a data type, and the compiler will enforce its usage.

```scala
val list: List[Int] = List(1, 2, 3)
```

### Implementation in Scala:

To create a parametrically polymorphic function in Scala, we use the [] syntax:

```scala
// [A] is the type parameter and it can be any type
def foo[A](a: A): A = a
```

## Subtype Polymorphism

Subtype Polymorphism, often associated with inheritance, occurs when we extend a base type to create a new type with similar behavior adapted to that specific type.

### What is it?

Subtype Polymorphism is when we have a base type with a _set_ of different behaviours (_functions_) and we extend that base type to create a new type with the same behaviour but adapted to that specific type.

### Where is it used?

This concept is extensively utilized in libraries such as [dolphin](https://github.com/lapsusHQ/dolphin/blob/main/modules/core/src/main/scala/ProjectionManager.scala), Cats, and Zio. It's also a common practice in Scala codebases.

### Implementation in Scala:

```scala

trait Shape {
  def area: Double
}

case class Circle(radius: Double) extends Shape {
  def area: Double = Math.PI * radius * radius
}

case class Square(side: Double) extends Shape {
  def area: Double = side * side
}

def printArea(shape: Shape): Unit = println(shape.area)

printArea(Circle(1.0)) // 3.141592653589793
printArea(Square(1.0)) // 1.0
```

## Ad-hoc Polymorphism

Ad-hoc Polymorphism, also known as overloading, occurs when we have a function with the same name but different implementations. For example, a function foo might add two numbers or concatenate two strings.

### Usage:

This form of polymorphism is heavily utilized in the Scala ecosystem. For instance, in the `cats` library, the `Semigroup` trait defines a behavior to combine two values.

### Implementation in Scala:

One way to achieve it in Scala is through the use of implicits. Below is an example of creating an Addable type class that can be used to add two arbitrary values:

```scala
trait Addable[A] {
  def add(a: A, b: A): A
}

object Addable {
    // We can use the following pattern to create a "summoner" method
    // Summoner Pattern
    def apply[A: Addable]: Addable[A] = implicitly[Addable[A]]

    implicit val intAddable: Addable[Int] = (a: Int, b: Int) => a + b

    implicit val stringAddable: Addable[String] = (a: String, b: String) => a + b

    implicit def listAddable[A]: Addable[List[A]] = (a: List[A], b: List[A]) => a ++ b

    implicit class AddableOps[A: Addable](a: A) {
      def add(b: A): A = Addable[A].add(a, b)
    }
}

import Addable.*


Addable[Int].add(1, 2) // 3
Addable[String].add("foo", "bar") // "foobar"
Addable[List[Int]].add(List(1, 2, 3), List(4, 5, 6)) // List(1, 2, 3, 4, 5, 6)

// We can also use the "extension" method
// This extension method is possible due to the AddableOps implicit class

1.add(2) // 3
"foo".add("bar") // "foobar"
List(1, 2, 3).add(List(4, 5, 6)) // List(1, 2, 3, 4, 5, 6)
```

## Conclusion

And that’s it! We have explored the different types of polymorphism and how we can achieve them in Scala... in plain english. I hope you have enjoyed this post and see you in the next one! 👋
