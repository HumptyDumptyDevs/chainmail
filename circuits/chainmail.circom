pragma circom 2.1.5;

include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "@zk-email/circuits/utils/regex.circom";
include "@zk-email/zk-regex-circom/circuits/common/body_hash_regex.circom";


template Chainmail(maxHeadersLength, n, k) {
    
    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];
    signal input bodyHashIndex;
    signal input address; 

    // Witnesses and constraints for regex go here
    signal output pubkeyHash;
    signal output bhBase64[2];
    signal output fromEmailAddress;
  
    component EV = EmailVerifier(maxHeadersLength, 0, n, k, 1);
    EV.emailHeader <== emailHeader;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.emailHeaderLength <== emailHeaderLength;

    pubkeyHash <== EV.pubkeyHash;

    // FROM HEADER REGEX: 736,553 constraints
    signal input fromEmailIndex;

    signal (fromEmailFound, fromEmailReveal[maxHeadersLength]) <== FromAddrRegex(maxHeadersLength)(emailHeader);
    fromEmailFound === 1;

    var maxEmailLength = 50;

    signal fromEmailAddrPacks[2] <== PackRegexReveal(maxHeadersLength, maxEmailLength)(fromEmailReveal, fromEmailIndex);
    fromEmailAddress <== fromEmailAddrPacks[0];
    
    // BODY HASH REGEX
    signal (bodyHashFound, bodyHashReveal[maxHeadersLength]) <== BodyHashRegex(maxHeadersLength)(emailHeader);
    bodyHashFound === 1;

    var maxBodyHashLength = 100;

    signal bodyHash[4] <== PackRegexReveal(maxHeadersLength, maxBodyHashLength)(bodyHashReveal, bodyHashIndex);
    bhBase64[0] <== bodyHash[0];
    bhBase64[1] <== bodyHash[1];

}
component main { public [ address ] } = Chainmail(1024, 121, 17);