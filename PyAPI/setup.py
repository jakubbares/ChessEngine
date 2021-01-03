from setuptools import setup, Extension
from Cython.Distutils import build_ext

NAME = "chess-cython"
REQUIRES = ['numpy', 'cython']

SRC_DIR = "app"
PACKAGES = [SRC_DIR]

move_finder = Extension(SRC_DIR + ".move_finder",
                    [SRC_DIR + "/move_finder.pyx"],
                    libraries=[])

helper = Extension(SRC_DIR + ".helper",
                        [SRC_DIR + "/helper.pyx"],
                        libraries=[])

EXTENSIONS = [move_finder, helper]

if __name__ == "__main__":
    setup(install_requires=REQUIRES,
          packages=PACKAGES,
          zip_safe=False,
          name=NAME,
          cmdclass={"build_ext": build_ext},
          ext_modules=EXTENSIONS
          )
