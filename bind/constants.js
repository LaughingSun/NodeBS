/* 
 * The MIT License
 *
 * Copyright 2015 Erich.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var n,
    constants = Object.freeze( {
        O_RDONLY: 0,
        O_WRONLY: 1,
        O_RDWR: 2,
        S_IFMT: 61440,
        S_IFREG: 32768,
        S_IFDIR: 16384,
        S_IFCHR: 8192,
        S_IFLNK: 40960,
        O_CREAT: 256,
        O_EXCL: 1024,
        O_TRUNC: 512,
        O_APPEND: 8,
        E2BIG: 7,
        EACCES: 13,
        EADDRINUSE: 100,
        EADDRNOTAVAIL: 101,
        EAFNOSUPPORT: 102,
        EAGAIN: 11,
        EALREADY: 103,
        EBADF: 9,
        EBADMSG: 104,
        EBUSY: 16,
        ECANCELED: 105,
        ECHILD: 10,
        ECONNABORTED: 106,
        ECONNREFUSED: 107,
        ECONNRESET: 108,
        EDEADLK: 36,
        EDESTADDRREQ: 109,
        EDOM: 33,
        EEXIST: 17,
        EFAULT: 14,
        EFBIG: 27,
        EHOSTUNREACH: 110,
        EIDRM: 111,
        EILSEQ: 42,
        EINPROGRESS: 112,
        EINTR: 4,
        EINVAL: 22,
        EIO: 5,
        EISCONN: 113,
        EISDIR: 21,
        ELOOP: 114,
        EMFILE: 24,
        EMLINK: 31,
        EMSGSIZE: 115,
        ENAMETOOLONG: 38,
        ENETDOWN: 116,
        ENETRESET: 117,
        ENETUNREACH: 118,
        ENFILE: 23,
        ENOBUFS: 119,
        ENODATA: 120,
        ENODEV: 19,
        ENOENT: 2,
        ENOEXEC: 8,
        ENOLCK: 39,
        ENOLINK: 121,
        ENOMEM: 12,
        ENOMSG: 122,
        ENOPROTOOPT: 123,
        ENOSPC: 28,
        ENOSR: 124,
        ENOSTR: 125,
        ENOSYS: 40,
        ENOTCONN: 126,
        ENOTDIR: 20,
        ENOTEMPTY: 41,
        ENOTSOCK: 128,
        ENOTSUP: 129,
        ENOTTY: 25,
        ENXIO: 6,
        EOPNOTSUPP: 130,
        EOVERFLOW: 132,
        EPERM: 1,
        EPIPE: 32,
        EPROTO: 134,
        EPROTONOSUPPORT: 135,
        EPROTOTYPE: 136,
        ERANGE: 34,
        EROFS: 30,
        ESPIPE: 29,
        ESRCH: 3,
        ETIME: 137,
        ETIMEDOUT: 138,
        ETXTBSY: 139,
        EWOULDBLOCK: 140,
        EXDEV: 18,
        WSAEINTR: 10004,
        WSAEBADF: 10009,
        WSAEACCES: 10013,
        WSAEFAULT: 10014,
        WSAEINVAL: 10022,
        WSAEMFILE: 10024,
        WSAEWOULDBLOCK: 10035,
        WSAEINPROGRESS: 10036,
        WSAEALREADY: 10037,
        WSAENOTSOCK: 10038,
        WSAEDESTADDRREQ: 10039,
        WSAEMSGSIZE: 10040,
        WSAEPROTOTYPE: 10041,
        WSAENOPROTOOPT: 10042,
        WSAEPROTONOSUPPORT: 10043,
        WSAESOCKTNOSUPPORT: 10044,
        WSAEOPNOTSUPP: 10045,
        WSAEPFNOSUPPORT: 10046,
        WSAEAFNOSUPPORT: 10047,
        WSAEADDRINUSE: 10048,
        WSAEADDRNOTAVAIL: 10049,
        WSAENETDOWN: 10050,
        WSAENETUNREACH: 10051,
        WSAENETRESET: 10052,
        WSAECONNABORTED: 10053,
        WSAECONNRESET: 10054,
        WSAENOBUFS: 10055,
        WSAEISCONN: 10056,
        WSAENOTCONN: 10057,
        WSAESHUTDOWN: 10058,
        WSAETOOMANYREFS: 10059,
        WSAETIMEDOUT: 10060,
        WSAECONNREFUSED: 10061,
        WSAELOOP: 10062,
        WSAENAMETOOLONG: 10063,
        WSAEHOSTDOWN: 10064,
        WSAEHOSTUNREACH: 10065,
        WSAENOTEMPTY: 10066,
        WSAEPROCLIM: 10067,
        WSAEUSERS: 10068,
        WSAEDQUOT: 10069,
        WSAESTALE: 10070,
        WSAEREMOTE: 10071,
        WSASYSNOTREADY: 10091,
        WSAVERNOTSUPPORTED: 10092,
        WSANOTINITIALISED: 10093,
        WSAEDISCON: 10101,
        WSAENOMORE: 10102,
        WSAECANCELLED: 10103,
        WSAEINVALIDPROCTABLE: 10104,
        WSAEINVALIDPROVIDER: 10105,
        WSAEPROVIDERFAILEDINIT: 10106,
        WSASYSCALLFAILURE: 10107,
        WSASERVICE_NOT_FOUND: 10108,
        WSATYPE_NOT_FOUND: 10109,
        WSA_E_NO_MORE: 10110,
        WSA_E_CANCELLED: 10111,
        WSAEREFUSED: 10112,
        SIGHUP: 1,
        SIGINT: 2,
        SIGILL: 4,
        SIGABRT: 22,
        SIGFPE: 8,
        SIGKILL: 9,
        SIGSEGV: 11,
        SIGTERM: 15,
        SIGBREAK: 21,
        SIGWINCH: 28,
        SSL_OP_ALL: 2147486719,
        SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144,
        SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304,
        SSL_OP_CISCO_ANYCONNECT: 32768,
        SSL_OP_COOKIE_EXCHANGE: 8192,
        SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648,
        SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048,
        SSL_OP_EPHEMERAL_RSA: 2097152,
        SSL_OP_LEGACY_SERVER_CONNECT: 4,
        SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 32,
        SSL_OP_MICROSOFT_SESS_ID_BUG: 1,
        SSL_OP_MSIE_SSLV2_RSA_PADDING: 0,
        SSL_OP_NETSCAPE_CA_DN_BUG: 536870912,
        SSL_OP_NETSCAPE_CHALLENGE_BUG: 2,
        SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 1073741824,
        SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 8,
        SSL_OP_NO_COMPRESSION: 131072,
        SSL_OP_NO_QUERY_MTU: 4096,
        SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536,
        SSL_OP_NO_SSLv2: 16777216,
        SSL_OP_NO_SSLv3: 33554432,
        SSL_OP_NO_TICKET: 16384,
        SSL_OP_NO_TLSv1: 67108864,
        SSL_OP_NO_TLSv1_1: 268435456,
        SSL_OP_NO_TLSv1_2: 134217728,
        SSL_OP_PKCS1_CHECK_1: 0,
        SSL_OP_PKCS1_CHECK_2: 0,
        SSL_OP_SINGLE_DH_USE: 1048576,
        SSL_OP_SINGLE_ECDH_USE: 524288,
        SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 128,
        SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0,
        SSL_OP_TLS_BLOCK_PADDING_BUG: 512,
        SSL_OP_TLS_D5_BUG: 256,
        SSL_OP_TLS_ROLLBACK_BUG: 8388608,
        NPN_ENABLED: 1
    } );
exports.constants = constants;