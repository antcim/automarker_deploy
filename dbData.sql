--
-- PostgreSQL database dump
--

-- Dumped from database version 13.7
-- Dumped by pg_dump version 13.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, "lastName", username, hash, salt, "createdAt", role) FROM stdin;
eb0b7bee-0ecd-4788-b222-a3dca292ce1d	admin	admin	admin@gmail.com	f79fa740b11aefcff61850eeec9ec194ed5ccb9ec66f06cc01681bafe71a74d9f44d54c91900388bc4e1f7aaad9a4861633c4b5bcc0e901457cc22ea88af1482	f796236fc600b6a6f126e9caf84bca57	1669297384578	ADMIN
664d21b0-83ee-41ec-8818-5f638ca58315	Pietro	Ferrara	pietro.ferrara@gmail.com	c6d5fa3ac3def9c0390e496c972769a6cdf7e8b991e51ceb1b22bafe549d6b0f76cb885d0b748b411d29e16c15b4e179f9d3acd529d146a3a97263a64db4c109	8bc708bbfe55394f954c74dff16ee741	1669297493836	PROF
3bc34dd6-2ac5-4331-9514-4a97bd4d6af9	Francesco	Vinci	francesco98vinci@gmail.com	f362cbc94e1b400c8ac7619ea93f696b0d9d593fea841c98a1a606c4f98b58cdbe980be8a763967f091e6108f22e7f2869ad17053bc8b9941117971f16fdf519	4ca34ea49411ec0fd603e3639409b638	1669297532861	USER
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, name, "userId", "academicYear") FROM stdin;
318ce900-7a41-41af-8caf-fd4e8bbf37c3	Programmazione a Oggetti	664d21b0-83ee-41ec-8818-5f638ca58315	2022/2023
\.


--
-- Data for Name: Registration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Registration" (id, "userId", "courseId", "createdAt") FROM stdin;
fe24556b-c107-494b-846b-d75934ed2ba8	3bc34dd6-2ac5-4331-9514-4a97bd4d6af9	318ce900-7a41-41af-8caf-fd4e8bbf37c3	1669297716919
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, "courseId", title, assignment, deadline, "testCase", hint, solution, "createdAt", language, placeholder) FROM stdin;
9ee2242e-3151-4f73-a7c3-f05d775f2dbe	318ce900-7a41-41af-8caf-fd4e8bbf37c3	Task 1: Add Two Numbers	Automarker task example\nAutomarker task example\nYou are given two  **non-empty**  linked lists representing two non-negative integers. The digits are stored in  **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\n**Example 1:**\n\n![](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)\n```js\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.\n```\n**Example 2:**\n```js\nInput: l1 = [0], l2 = [0]\nOutput: [0]\n```\n**Example 3:**\n```js\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\n```\n**Constraints:**\n\n-   The number of nodes in each linked list is in the range  `[1, 100]`.\n-   `0 <= Node.val <= 9`\n-   It is guaranteed that the list represents a number that does not have leading zeros.\nYou are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\nExample 1:\n\n\n\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.\nExample 2:\n\nInput: l1 = [0], l2 = [0]\nOutput: [0]\nExample 3:\n\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\nConstraints:\n\nThe number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros.\nMarkdown selection 870 bytes 140 words 26 lines Ln 27, Col 88HTML 593 characters 130 words 16 paragraphs	1670680020000	Input: l1 = [2,4,3], l2 = [5,6,4]\n	## Solution\n\n#### Approach 1: Elementary Math\n\n**Intuition**\n\nKeep track of the carry using a variable and simulate digits-by-digits sum starting from the head of list, which contains the least-significant digit.\n\n![Illustration of Adding two numbers](https://leetcode.com/problems/add-two-numbers/solutions/127833/Figures/2_add_two_numbers.svg)\n\n_Figure 1. Visualization of the addition of two numbers:  $342+465=807342 + 465 = 807342+465=807$.  \nEach node contains a single digit and the digits are stored in reverse order._ \n\n**Algorithm**\n\nJust like how you would sum two numbers on a piece of paper, we begin by summing the least-significant digits, which is the head of  $l1$  and  $l2$. Since each digit is in the range of $ 0…9$, summing two digits may "overflow". For example  $5+7=12$. In this case, we set the current digit to  $2$  and bring over the  $carry=1$  to the next iteration.  $carry$  must be either  $0$  or  $1$ because the largest possible sum of two digits (including the carry) is  $9+9+1=19$.\n\nThe pseudocode is as following:\n\n-   Initialize current node to dummy head of the returning list.\n-   Initialize carry to  $0$.\n-   Loop through lists  $l1$  and  $l2$  until you reach both ends and crarry is  $0$.\n    -   Set  $x$  to node  $l1$'s value. If  $l1$  has reached the end of $l1$, set to  $0$.\n    -   Set  $y$  to node  $l2$'s value. If $l2$  has reached the end of  $l2$, set to  $0$.\n    -   Set  $sum=x+y+carry$.\n    -   Update $carry=sum/10$.\n    -   Create a new node with the digit value of  $(sum\\:mod\\:10)$ and set it to current node's next, then advance current node to next.\n    -   Advance both  $l1$  and $l2$.\n-   Return dummy head's next node.\n\nNote that we use a dummy head to simplify the code. Without a dummy head, you would have to write extra conditional statements to initialize the head's value.\n\nTake extra caution of the following cases:\n| Test case | Explanation |\n|--|--|\n| $l1=[0,1]\\:\\: l2=[0,1,2]$   | When one list is longer than the other. |\n| $l1=[]\\:\\:l2=[0,1]$  | When one list is null, which means an empty list.|\n| $l1=[9,9]\\:\\:l2=[1]$| The sum could have an extra carry of one at the end, which is easy to forget.|\n\n\n\n**Implementation**\nIn C++:\n```c++\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        ListNode* dummyHead = new ListNode(0);\n        ListNode* curr = dummyHead;\n        int carry = 0;\n        while (l1 != NULL || l2 != NULL || carry != 0) {\n            int x = l1 ? l1->val : 0;\n            int y = l2 ? l2->val : 0;\n            int sum = carry + x + y;\n            carry = sum / 10;\n            curr->next = new ListNode(sum % 10);\n            curr = curr->next;\n            l1 = l1 ? l1->next : nullptr;\n            l2 = l2 ? l2->next : nullptr;\n        }\n        return dummyHead->next;\n    }\n};\n```\n\n**Complexity Analysis**\n\n-   Time complexity :  $O(max⁡(m,n))$. Assume that  mmm  and  nnn  represents the length of $l1$ and  $l2$  respectively, the algorithm above iterates at most  $max⁡(m,n)$ times.\n    \n-   Space complexity :  $O(max⁡(m,n))$. The length of the new list is at most  $max⁡(m,n)+1$.\n    \n\n**Follow up**\n\nWhat if the the digits in the linked list are stored in non-reversed order? For example:\n\n$$(3→4→2)+(4→6→5)=8→0→7$$	Output: [7,0,8]	1669297696891	c	#include <stdio.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode* next;\n};\n\nListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {\n    //Type here the solution\n}\n\nint main() {\n    struct ListNode* head1 = NULL;\n    struct ListNode* head2 = NULL;\n    \n    head1 = (struct ListNode*)malloc(sizeof(struct ListNode));\n    head2 = (struct ListNode*)malloc(sizeof(struct ListNode));\n\n\n    head1->data = 1;\n    head1->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head1->next->data = 2;\n    head1->next->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head1->next->next->data = 3; // assign data to third node\n    head1->next->next->next = NULL;\n    \n    head2->data = 4;\n    head2->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head2->next->data = 5;\n    head2->next->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head2->next->next->data = 6;\n    head2->next->next->next = NULL;\n    \n    ListNode* res = addTwoNumbers(head1, head2);\n    \n    while (res != NULL) {\n        printf(" %d ", res->data);\n        res = res->next;\n    }\n    \n    return 0;\n    \n}
\.


--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Submission" (id, "userId", "taskId", mark, workspace, "isSubmitted", "submittedAt") FROM stdin;
c68f96b3-a9e5-4074-9efc-c4572f6f8fe7	3bc34dd6-2ac5-4331-9514-4a97bd4d6af9	9ee2242e-3151-4f73-a7c3-f05d775f2dbe	0	#include <stdio.h>\n#include <stdlib.h>\nstruct ListNode {\n    int val;\n    struct ListNode* next;\n};\n\nstruct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {\n    struct ListNode* currentl1 = l1;\n    struct ListNode* currentl2 = l2;\n    int carry = 0, num3 = 0;\n    struct ListNode* l3;\n    l3 = (struct ListNode*)malloc(sizeof(struct ListNode));\n    struct ListNode* currentl3 = l3;\n    \n    while(currentl1 || currentl2 || carry != 0){\n        int num1 = 0, num2 = 0, num3 = 0;\n        \n        if(currentl1){\n            num1 = currentl1->val;\n            currentl1 = currentl1->next;\n        }\n        \n        if(currentl2){\n            num2 = currentl2->val;\n            currentl2 = currentl2->next;\n        }\n        \n        if(num1 + num2 + carry >= 10){\n            num3 = (num1 + num2 + carry) % 10;\n            carry = 1;\n        } else {\n            \n            num3 = num1 + num2 + carry;\n            carry = 0;\n        }\n        \n        currentl3->val = num3;\n        if(!currentl1 && !currentl2 && carry == 0){\n            currentl3->next = NULL;\n        }else{\n            currentl3->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n            currentl3 = currentl3->next;\n        }\n        \n        \n    }\n    \n    return l3;\n    \n}\n\nint main() {\n    struct ListNode* head1 = NULL;\n    struct ListNode* head2 = NULL;\n    \n    head1 = (struct ListNode*)malloc(sizeof(struct ListNode));\n    head2 = (struct ListNode*)malloc(sizeof(struct ListNode));\n\n\n    head1->val = 1;\n    head1->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head1->next->val = 2;\n    head1->next->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head1->next->next->val = 3; // assign data to third node\n    head1->next->next->next = NULL;\n    \n    head2->val = 4;\n    head2->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head2->next->val = 5;\n    head2->next->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    \n    head2->next->next->val = 6;\n    head2->next->next->next = NULL;\n    \n    struct ListNode* res = addTwoNumbers(head1, head2);\n    \n    while (res != NULL) {\n        printf(" %d ", res->val);\n        res = res->next;\n    }\n    \n    return 0;\n    \n}	f	1669298678518
\.


--
-- PostgreSQL database dump complete
--

