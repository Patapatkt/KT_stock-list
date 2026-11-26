-- サンプルデーダをtableに入れる

INSERT INTO stocks (location, productNumber, inquiry, quantity)
VALUES('A01001','りんご','M',12);
INSERT INTO stocks (location, productNumber, inquiry, quantity)
VALUES('A01002','りんご','L',8);
INSERT INTO stocks (location, productNumber, inquiry, quantity)
 VALUES('B02001','みかん','M',20);

INSERT INTO histories(createdAt,movementType,location, productNumber, inquiry, quantity)
VALUES('2026-11-1T00:00','入庫','A01001','りんご','M',12);
INSERT INTO histories(createdAt,movementType,location, productNumber, inquiry, quantity)
VALUES('2026-11-10T23:00','入庫','A01001','りんご','M',12);