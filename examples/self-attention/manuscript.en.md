# Scaled Dot-Product Attention: A Worked Example

This is a one-chapter textbook built from a single source: Vaswani et al. (2017), "Attention Is
All You Need" (arXiv:1706.03762), limited to the abstract and Section 3.2.1 (including that
section's footnote 4).

Sentences that make claims about the paper carry an evidence grade. `[confirmed]` means the paper
states it directly. `[general]` means an established fact of linear algebra or probability.
`[inferred]` means a reading or example that follows from confirmed or general statements but that
the paper does not state itself. `[not found]` means the claim was not found in the part of the paper
used here (the abstract and Section 3.2.1); other sections of the paper may still contain it.

# Part 1. Understanding Scaled Dot-Product Attention

## Chapter 1. Scaled Dot-Product Attention

**Learning objective.** Understand what Q, K, and V each stand for well enough to explain, one
step at a time, what the formula `softmax(QKᵀ/√d_k)V` computes.

> **Reading the source.** “We call our particular attention "Scaled Dot-Product Attention" (Figure
> 2). The input consists of queries and keys of dimension d_k, and values of dimension d_v. We
> compute the dot products of the query with all keys, divide each by √d_k, and apply a
> softmax function to obtain the weights on the values.”[^1]

[confirmed] The paper writes this computation as `Attention(Q, K, V) = softmax(QKᵀ / √d_k) V`.[^1]

### 1.1 Queries, keys, and values

**Concept: queries, keys, and values (Q, K, V).** Q, K, and V are all matrices, each a stack of vectors
[confirmed]. A query (Q) can be read as a vector for "what this position is looking for", a key (K)
as one for "what each position has to offer", and a value (V) as one for "the content that position
actually hands over" [inferred]. Here a "position" is where one word of the sentence sits. This
book's reading of why there are three roles: to adjust the matching rule (Q against K) and the
content that gets mixed in (V) separately during training, they have to be kept apart [inferred].
Example: in the sentence "She sat on the bank of the river", the query for "bank" asks for clues that
settle which meaning of "bank" is meant; if it matches the key for "river" best, the value for
"river" makes up a large share of what "bank" receives [inferred].

*Quick check.* If the query and the value were the same vector (Q = V), what would the design
lose? Answer: "what to look for" and "what to hand over" could no longer be adjusted separately.

### 1.2 The dot product

**Concept: the dot product (QKᵀ).** The dot product of two vectors multiplies their matching
components and adds up the results [general]. The result is larger the more the two vectors point
the same way and the longer the vectors are [general]. `QKᵀ` computes the dot product of every
query with every key in one step, producing a table (a matrix) of numbers [confirmed]. Each entry of
that table can be read as "how well one query matches one key" [inferred].

*Quick check.* With 5 queries and 7 keys, how many rows and columns does `QKᵀ` have? Answer: 5
rows and 7 columns, one dot product per query-key pair.

### 1.3 Scaling

**Concept: scaling (dividing by √d_k).** Dot products tend to grow as the vector dimension d_k
grows [general]. The paper's footnote 4 gives the reason: if the components of q and k are
independent random values with mean 0 and variance 1 (variance is how spread out the values are),
their dot product has variance d_k [confirmed].[^2] The next sentence gives the reason for dividing:
the authors "suspect" that large dot products push the softmax into regions where it has extremely
small gradients (the gradient is how much the output changes when the input changes a little)
[confirmed]. When the gradient is that small, training gets only a weak signal for correcting the
values [general]. The section does not directly test the suspicion with an experiment or a proof
[not found].

*Quick check.* If d_k grows from 4 to 400, the divisor √d_k grows from 2 to what? Answer: 20.

### 1.4 Softmax

**Concept: softmax.** Softmax takes a list of numbers and turns it into a list of positive
numbers that add up to 1, with a larger input getting a larger share [general]. In
`Attention(Q,K,V)`, softmax turns each query's row of match scores into weights that say how much
attention each key gets [confirmed]. Multiplying these weights by the values (V) and adding them
up gives the output for that query's position [confirmed] (the paper's Equation 1).

**Exercise 1.** A reader who has never worked out what dividing by √d_k does to the size of the
softmax inputs can only answer "why is this division needed?" by reciting the formula.

1. Take two vectors with d_k = 2 whose components are all 1. Compute their dot product, then divide it by √d_k.
2. Do the same for two vectors with d_k = 200 whose components are all 1.
3. When d_k goes from 2 to 200, by what factor does the dot product grow, and by what factor does the divided value grow?

**Review 1.**
1. Which of Q, K, and V stands for "what to look for"? (a) Q (b) K (c) V
2. Each entry of `QKᵀ` is the ( ) of two vectors.
3. After softmax, what do the resulting values always add up to?

Answers: Appendix A.

## Glossary

**query (Q)** — A vector for what the current position is looking for.

**key (K)** — A vector for what each position has to offer.

**value (V)** — A vector for the content a position actually hands over.

**dot product** — The sum of the products of two vectors' matching components; it grows the more the two vectors point the same way and the longer they are.

**d_k** — The dimension (number of components) of the query and key vectors. The dimension of the value vectors is written d_v.

**softmax** — A function that turns a list of numbers into a list of positive numbers (shares) that add up to 1.

# Appendix

## Appendix A. Answers

**Chapter 1, Exercise 1.**
1. 1×1 + 1×1 = 2. Divided by √2, about 1.41.
2. 1×1 added 200 times = 200. Divided by √200, about 14.1.
3. The dot product grows 100× (2 → 200) and the divided value grows 10× (1.41 → 14.1, which is √100). The division does not stop the growth, but it slows it from 100× to 10×.

**Chapter 1, Review.** 1) (a) Q  2) dot product  3) 1

## Appendix B. Footnotes

[^1]: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin, "Attention Is All You Need," arXiv:1706.03762 (2017), §3.2.1.
[^2]: Same paper, §3.2.1, footnote 4: "To illustrate why the dot products get large, assume that the components of q and k are independent random variables with mean 0 and variance 1."
