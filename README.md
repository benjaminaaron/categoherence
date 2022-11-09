# categoherence

The idea is to quantify *how things stick together* across multiple categorizations.<br>
The word *categoherence* is a combination of *category* and *coherence*. 

### use cases 

I assume there to be various potential use cases. These are the two I am having in mind at the moment:

#### brainstorming

In the convergence phase of a brainstorming it is common to cluster Post-it notes together to identify topics or ideas that belong together. This process of convergence (sorting, clustering, categorization) is often done by one or few persons that take lead in the structuring. They are authorized by assignment, expertise, insight, group dynamics or by a combination of these.<br>
I think it could lead to valuable insights to instead have multiple or all participants do the clustering on their own, and then analyze which combination of Post-it stick together how many times.<br>
That being said, I do understand that the shared process of convergence can be important for building consensus and the feeling of having created something together among the participants.

#### resourcing

Assembling teams for a project is either a task for management, or done by the participants themselves (e.g. group work in a classroom). In the first case, the team-assembler might be tasked to do research beforehand as to who worked with whom on what topic before, unless that person is so embedded in the field, that his or her sense for the people at hand is suitable enough.
<br>
In both cases it could be interesting to see what kind of grouping patterns have a lot of "gravity" in the social field. In the team-assembler case one would feed historical team-data (including labels for the topics that were worked on) into the algorithm, whereas in the self-assembly-case the personal group-choices of individuals would be fed in.
<br>
After the analysis, automatic suggestions could then be made for a best-match group or for a grouping pattern for the entire group.
<br>
As above, here it can also be said, that using algorithms for such a task might make the potentially important social process of assembling groups alienable. Maybe it could be interesting to "charge" submissions with the task of assembling the best possible groups, rather than my personal favorite ones. Or even allow the submission of anti-groups that will yield negative points in the scoring.

## Setup

Install and start MongoDB following [these](https://www.mongodb.com/docs/manual/administration/install-community/) instructions. Some instructions how to query your local MongoDB [here](https://github.com/FuturICT2/FIN4NotificationServer#mongodb).
```
npm install
npm start
```

## Usage
- go to `localhost:3000/create` to create a new session
- thereafter your session is open for submissions at `/session-id`
- results of a session can be viewed at `/session-id/results`
- at `/dashboard` all currently active sessions are listed and can be closed individually
