# Contribution Guidelines

## Table of Contents

  - [Contribution Guidelines](#contribution-guidelines)
  - [Introduction](#introduction)
  - [Bug reports](#bug-reports)
  - [Discuss your design](#discuss-your-design)
  - [Code review](#code-review)
  - [Styleguide](#styleguide)
  - [Design guideline](#design-guideline)
  - [API v1](#api-v1)
  - [Developer Certificate of Origin (DCO)](#developer-certificate-of-origin-dco)
  - [Release Cycle](#release-cycle)

## Introduction

This document explains how to contribute changes to the Kudoo project.
It assumes you have followed the
installation instructions.
Sensitive security-related issues should be reported to
[jtrollip@kudoo.io](mailto:jtrollip@kudoo.io).

## Bug reports

Please search the issues on the issue tracker with a variety of keywords
to ensure your bug is not already reported.

If unique, [open an issue](https://github.com/kudoo-cloud/kudoo/issues/new)
and answer the questions so we can understand and reproduce the
problematic behavior.

To show us that the issue you are having is in Kudoo itself, please
write clear, concise instructions so we can reproduce the behavior—
even if it seems obvious. The more detailed and specific you are,
the faster we can fix the issue. Check out [How to Report Bugs
Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html).

Please be kind, remember that Kudoo comes at no cost to you, and you're
getting free help.

## Discuss your design

The project welcomes submissions. If you want to change or add something,
please let everyone know what you're working on—[file an issue](https://github.com/kudoo-cloud/kudoo/issues/new)!
Significant changes must go through the change proposal process
before they can be accepted. To create a proposal, file an issue with
your proposed changes documented, and make sure to note in the title
of the issue that it is a proposal.

This process gives everyone a chance to validate the design, helps
prevent duplication of effort, and ensures that the idea fits inside
the goals for the project and tools. It also checks that the design is
sound before code is written; the code review tool is not the place for
high-level discussions.

## Code review

Changes to Kudoo must be reviewed before they are accepted—no matter who
makes the change, even if they are an owner or a maintainer. We use GitHub's
pull request workflow to do that. And, we also use [LGTM](http://lgtm.co)
to ensure every PR is reviewed by at least 2 maintainers.

Please try to make your pull request easy to review for us. And, please read
the *[How to get faster PR reviews](https://github.com/kubernetes/community/blob/261cb0fd089b64002c91e8eddceebf032462ccd6/contributors/guide/pull-requests.md#best-practices-for-faster-reviews)* guide;
it has lots of useful tips for any project you may want to contribute.
Some of the key points:

* Make small pull requests. The smaller, the faster to review and the
  more likely it will be merged soon.
* Don't make changes unrelated to your PR. Maybe there are typos on
  some comments, maybe refactoring would be welcome on a function... but
  if that is not related to your PR, please make *another* PR for that.
* Split big pull requests into multiple small ones. An incremental change
  will be faster to review than a huge PR.

## Styleguide
TODO:

## Developer Certificate of Origin (DCO)

We consider the act of contributing to the code by submitting a Pull
Request as the "Sign off" or agreement to the certifications and terms
of the [DCO](DCO) and [MIT license](LICENSE). No further action is required.
Additionally you could add a line at the end of your commit message.

```
Signed-off-by: Joe Smith <joe.smith@email.com>
```

If you set your `user.name` and `user.email` git configs, you can add the
line to the end of your commit automatically with `git commit -s`.

We assume in good faith that the information you provide is legally binding.

## Release Cycle

We adopted a release schedule to streamline the process of working
on, finishing, and issuing releases. The overall goal is to make a
minor release every two months, which breaks down into one month of
general development followed by one month of testing and polishing
known as the release freeze. All the feature pull requests should be
merged in the first month of one release period. And, during the frozen
period, a corresponding release branch is open for fixes backported from
master. Release candidates are made during this period for user testing to
obtain a final version that is maintained in this branch. A release is
maintained by issuing patch releases to only correct critical problems
such as crashes or security issues.

Major release cycles are bimonthly. They always begin on the 25th and end on
the 24th (i.e., the 25th of December to February 24th).

During a development cycle, we may also publish any necessary minor releases
for the previous version. For example, if the latest, published release is
v1.2, then minor changes for the previous release—e.g., v1.1.0 -> v1.1.1—are
still possible.