---
title: "Polymorphism in Plain English"
date: 2023-04-20T20:50:51Z
draft: false
tags: ["scala", "polymorphism", "programming"]
categories: ["programming"]
cover:
    alt: "Polymorphism in Plain English"
    caption: "Polymorphism in Plain English"
---

When we hear polymorphism, the first thing that comes to mind is generics. However, polymorphism is a much richer concept than that. In this short post we will be exploring the different types of polymorphism and how we can achieve them in Scala… in plain English.

## Parametric Polymorphism

### What is Parametric Polymorphism?

Parametric polymorphism can be thought of as good old plain generics. When we talk about Parametric Polymorphism, is using a “parameter” to define the “type” of behaviour we want to achieve with our code.

### Where is it used?

Parametric Polymorphism is very common in both Object Oriented and Functional Programming. One of the most common examples is when we use a data structure. For example, when we use a `List` in Scala, we can define a data type and the compiler will correctly enforce that we can only use that data type in our `List`.

```scala
val list: List[Int] = List(1, 2, 3)
```

### How do we achieve it in Scala?

To create a parametrically polymorphic function in Scala, we simply need to use the `[]` syntax. For example,

```scala
// [A] is the type parameter and it can be any type
def foo[A](a: A): A = a
```

## Subtype Polymorphism

Subtype Polymorphism is a super common concept in the Object Oriented world. Where this is known as ✨inheritance✨.

### What is it?

Subtype Polymorphism is when we have a base type with a _set_ of different behaviours (_functions_) and we extend that base type to create a new type with the same behaviour but adapted to that specific type.

### Where is it used?

This is heavily used in many libraries. For example, in [`dolphin`](https://github.com/lapsusHQ/dolphin/blob/main/modules/core/src/main/scala/ProjectionManager.scala) library, we have the trait `ProjectionManager[F[_]]` which defines a set of behaviours that we can use to manage and create projections. We also have it in more common libraries such as `Cats` and `Zio`. Finally, the odds of finding it in your company codebase (if you are using Scala) are very high.

### How do we achieve it in Scala?

To create a subtype polymorphic function in Scala, we simply need to use the extends syntax. For example,

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

Ad-hoc Polymorphism is a different yet super useful beast. It is also known in the Object Oriented world as ✨overloading✨.

### What is it?

Ad-hoc Polymorphism is when we have a function with the same name but different implementation. For example, we can have a function `foo` that adds two numbers or concatenates two strings.

### Where is it used?

Ad-hoc polymorphism is heavily used in the Scala ecosystem. For example, in the `cats` library, we have the `Semigroup` trait which defines a behaviour to combine two values.

### How do we achieve it in Scala?

One way to achieve it in Scala is through the use of implicit. The following example shows how we can create an Addable type class that can be used to add two arbitrary values:

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
